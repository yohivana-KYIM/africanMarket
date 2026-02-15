import { useState, useRef, useCallback, useEffect } from "react";
import type { Product } from "../types";
import { mapProduct } from "./useProducts";
import environment from "../environment";

const API = `${environment.API_URL}/api/products`;

export type CameraState =
  | "idle"
  | "loading-model"
  | "viewfinder"
  | "capturing"
  | "results"
  | "error";

interface Classification {
  className: string;
  probability: number;
}

interface DetectedCategory {
  label: string;
  searchTerm: string;
  confidence: number;
}

const LABEL_MAP: Record<string, string> = {
  // Sacs
  handbag: "sac a main",
  purse: "sac a main",
  clutch: "pochette",
  bag: "sac",
  "shopping_basket": "sac",
  "plastic_bag": "sac",
  "mailbag": "sac",
  backpack: "sac a dos",
  knapsack: "sac a dos",
  "pack": "sac a dos",
  // Chaussures
  sandal: "sandales",
  "running_shoe": "baskets",
  sneaker: "baskets",
  "shoe_shop": "chaussures",
  "loafer": "chaussures",
  "boot": "chaussures",
  "clog": "chaussures",
  "oxford": "chaussures",
  // Accessoires
  wallet: "portefeuille",
  billfold: "portefeuille",
  sunglass: "lunettes",
  sunglasses: "lunettes",
  "eyeglass": "lunettes",
  watch: "montre",
  "digital_watch": "montre",
  "analog_clock": "montre",
  necklace: "bijoux",
  bracelet: "bijoux",
  ring: "bijoux",
  // Parfums
  perfume: "parfum",
  "lotion": "parfum",
  // Vetements
  jersey: "vetements",
  shirt: "vetements",
  dress: "vetements",
  "suit": "vetements",
  "jean": "vetements",
  "miniskirt": "vetements",
  skirt: "vetements",
  "coat": "vetements",
  "trench_coat": "vetements",
  "poncho": "vetements",
  "kimono": "vetements",
  "bikini": "vetements",
  "swimming_trunks": "vetements",
  "pajama": "vetements",
  "bow_tie": "vetements",
  "neck_brace": "accessoires",
  // Divers
  hat: "chapeau",
  sombrero: "chapeau",
  cap: "casquette",
  scarf: "foulard",
  stole: "foulard",
  umbrella: "parapluie",
  belt: "ceinture",
  "buckle": "ceinture",
};

export const useCameraSearch = () => {
  const [state, setState] = useState<CameraState>("idle");
  const [error, setError] = useState<string>("");
  const [detectedCategories, setDetectedCategories] = useState<DetectedCategory[]>([]);
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string>("");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const modelRef = useRef<any>(null);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const searchProducts = useCallback(async (term: string) => {
    setActiveSearchTerm(term);
    setSearchLoading(true);
    try {
      const res = await fetch(
        `${API}?search=${encodeURIComponent(term)}&limit=8`
      );
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setResults(data.products.map(mapProduct));
    } catch {
      setResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const matchLabel = (className: string): string | null => {
    const lower = className.toLowerCase().replace(/,/g, "");
    const words = lower.split(/[\s_]+/);

    // Direct match on full className tokens
    for (const token of className.split(", ")) {
      const key = token.trim().toLowerCase().replace(/\s+/g, "_");
      if (LABEL_MAP[key]) return LABEL_MAP[key];
    }

    // Match individual words
    for (const word of words) {
      if (LABEL_MAP[word]) return LABEL_MAP[word];
    }

    return null;
  };

  const open = useCallback(async () => {
    setError("");
    setDetectedCategories([]);
    setResults([]);
    setActiveSearchTerm("");
    setCapturedImage("");

    // Check browser support
    if (!navigator.mediaDevices?.getUserMedia) {
      setState("error");
      setError("Votre navigateur ne supporte pas l'acces a la camera.");
      return;
    }

    setState("loading-model");

    try {
      // Lazy load TF.js and MobileNet in parallel with camera access
      const [mobilenetModule, stream] = await Promise.all([
        (async () => {
          if (modelRef.current) return null;
          const tf = await import("@tensorflow/tfjs");
          await tf.ready();
          const mn = await import("@tensorflow-models/mobilenet");
          const model = await mn.load({ version: 2, alpha: 1.0 });
          modelRef.current = model;
          return null;
        })(),
        navigator.mediaDevices
          .getUserMedia({
            video: { facingMode: { ideal: "environment" }, width: { ideal: 640 }, height: { ideal: 480 } },
            audio: false,
          })
          .catch((err: DOMException) => {
            if (err.name === "NotAllowedError") {
              throw new Error(
                "Acces a la camera refuse. Autorisez l'acces dans les parametres."
              );
            }
            if (err.name === "NotFoundError") {
              throw new Error("Aucune camera detectee sur cet appareil.");
            }
            throw new Error(
              "Impossible d'acceder a la camera. Verifiez vos permissions."
            );
          }),
      ]);

      streamRef.current = stream as MediaStream;
      // Stream will be assigned to video element via the useEffect when state becomes "viewfinder"
      setState("viewfinder");
    } catch (err: any) {
      stopStream();
      setState("error");
      setError(
        err?.message ||
          "Impossible de charger le modele. Verifiez votre connexion."
      );
    }
  }, [stopStream]);

  const capture = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !modelRef.current) return;

    setState("capturing");

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    // Save captured image
    setCapturedImage(canvas.toDataURL("image/jpeg", 0.8));

    // Stop camera stream after capture
    stopStream();

    try {
      const predictions: Classification[] =
        await modelRef.current.classify(canvas, 5);

      const detected: DetectedCategory[] = [];
      const seenTerms = new Set<string>();

      for (const pred of predictions) {
        const searchTerm = matchLabel(pred.className);
        if (searchTerm && !seenTerms.has(searchTerm)) {
          seenTerms.add(searchTerm);
          detected.push({
            label: pred.className.split(",")[0].trim(),
            searchTerm,
            confidence: Math.round(pred.probability * 100),
          });
        }
      }

      if (detected.length === 0) {
        setState("error");
        setError(
          "Objet non reconnu. Essayez un autre angle ou meilleur eclairage."
        );
        return;
      }

      setDetectedCategories(detected);
      setState("results");
      await searchProducts(detected[0].searchTerm);
    } catch {
      setState("error");
      setError("Erreur lors de l'analyse de l'image. Reessayez.");
    }
  }, [stopStream, searchProducts]);

  const retake = useCallback(async () => {
    setDetectedCategories([]);
    setResults([]);
    setActiveSearchTerm("");
    setCapturedImage("");
    setError("");

    setState("loading-model");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });

      streamRef.current = stream;
      // Stream will be assigned to video element via the useEffect when state becomes "viewfinder"
      setState("viewfinder");
    } catch {
      setState("error");
      setError("Impossible de reactiver la camera.");
    }
  }, []);

  const close = useCallback(() => {
    stopStream();
    setState("idle");
    setError("");
    setDetectedCategories([]);
    setResults([]);
    setActiveSearchTerm("");
    setCapturedImage("");
  }, [stopStream]);

  // Assign stream to video element once it's rendered in viewfinder state
  useEffect(() => {
    if (state === "viewfinder" && videoRef.current && streamRef.current) {
      const video = videoRef.current;
      if (!video.srcObject) {
        video.srcObject = streamRef.current;
        video.play().catch(() => {});
      }
    }
  }, [state]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStream();
    };
  }, [stopStream]);

  return {
    state,
    error,
    detectedCategories,
    activeSearchTerm,
    results,
    searchLoading,
    capturedImage,
    videoRef,
    canvasRef,
    open,
    capture,
    retake,
    close,
    searchProducts,
  };
};
