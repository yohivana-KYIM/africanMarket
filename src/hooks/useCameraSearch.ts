import { useState, useRef, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import type { Product } from "../types";
import { mapProduct } from "./useProducts";
import environment from "../environment";

const API = `${environment.API_URL}/api/products`;

const TOAST_STYLE = { background: "#19110b", color: "#fff", borderRadius: "0", fontSize: "12px" };

export type CameraState =
  | "idle"
  | "loading-model"
  | "viewfinder"
  | "capturing"
  | "results"
  | "error";

export type LoadingStage = "init" | "tensorflow" | "model" | "camera" | "ready";
export type AnalyzingStage = "capturing" | "detecting" | "classifying" | "searching";

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
  const [loadingStage, setLoadingStage] = useState<LoadingStage>("init");
  const [analyzingStage, setAnalyzingStage] = useState<AnalyzingStage>("capturing");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const modelRef = useRef<any>(null);

  // Callback ref: fires when React mounts/unmounts the <video> element
  const connectVideoRef = useCallback((el: HTMLVideoElement | null) => {
    videoRef.current = el;
    if (el && streamRef.current && !el.srcObject) {
      el.srcObject = streamRef.current;
      el.play().catch(() => {});
    }
  }, []);

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
    setLoadingStage("init");
    setAnalyzingStage("capturing");

    // Check browser support
    if (!navigator.mediaDevices?.getUserMedia) {
      setState("error");
      setError("Votre navigateur ne supporte pas l'acces a la camera.");
      toast.error("Camera non supportee par ce navigateur", { style: TOAST_STYLE });
      return;
    }

    setState("loading-model");

    try {
      const withTimeout = <T,>(promise: Promise<T>, ms: number, label: string): Promise<T> =>
        Promise.race([
          promise,
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error(`${label} : delai depasse (${ms / 1000}s)`)), ms)
          ),
        ]);

      // Lazy load TF.js and MobileNet in parallel with camera access
      const [, stream] = await Promise.all([
        (async () => {
          if (modelRef.current) {
            setLoadingStage("ready");
            return null;
          }
          setLoadingStage("tensorflow");
          const tf = await withTimeout(import("@tensorflow/tfjs"), 30000, "Chargement TensorFlow");
          await withTimeout(tf.ready(), 20000, "Initialisation TensorFlow");
          setLoadingStage("model");
          const mn = await withTimeout(import("@tensorflow-models/mobilenet"), 20000, "Chargement MobileNet");
          const model = await withTimeout(
            mn.load({ version: 2, alpha: 0.5 }),
            60000,
            "Telechargement du modele"
          );
          modelRef.current = model;
          setLoadingStage("ready");
          return null;
        })(),
        (async () => {
          setLoadingStage((prev) => prev === "init" ? "camera" : prev);
          const stream = await navigator.mediaDevices
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
            });
          return stream;
        })(),
      ]);

      streamRef.current = stream as MediaStream;
      toast.success("Camera activee", { style: TOAST_STYLE, icon: "📸" });
      // Stream will be assigned to video element via the useEffect when state becomes "viewfinder"
      setState("viewfinder");
    } catch (err: any) {
      stopStream();
      setState("error");
      const msg = err?.message || "Impossible de charger le modele. Verifiez votre connexion.";
      setError(msg);
      toast.error(msg, { style: TOAST_STYLE });
    }
  }, [stopStream]);

  const capture = useCallback(async () => {
    if (!modelRef.current) {
      toast.error("Le modele IA n'est pas charge. Fermez et reessayez.", { style: TOAST_STYLE });
      return;
    }
    if (!videoRef.current || !canvasRef.current) return;

    setAnalyzingStage("capturing");
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
      setAnalyzingStage("detecting");
      const predictions: Classification[] =
        await modelRef.current.classify(canvas, 5);

      setAnalyzingStage("classifying");
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
        toast.error("Aucun objet reconnu", { style: TOAST_STYLE });
        return;
      }

      toast.success(
        `${detected.length} objet${detected.length > 1 ? "s" : ""} detecte${detected.length > 1 ? "s" : ""}`,
        { style: TOAST_STYLE, icon: "✓" }
      );

      setAnalyzingStage("searching");
      setDetectedCategories(detected);
      setState("results");
      await searchProducts(detected[0].searchTerm);
    } catch {
      setState("error");
      const msg = "Erreur lors de l'analyse de l'image. Reessayez.";
      setError(msg);
      toast.error(msg, { style: TOAST_STYLE });
    }
  }, [stopStream, searchProducts]);

  const retake = useCallback(async () => {
    setDetectedCategories([]);
    setResults([]);
    setActiveSearchTerm("");
    setCapturedImage("");
    setError("");
    setLoadingStage("init");
    setAnalyzingStage("capturing");

    // If model failed to load previously, do a full open() to reload everything
    if (!modelRef.current) {
      open();
      return;
    }

    setState("loading-model");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });

      streamRef.current = stream;
      setState("viewfinder");
    } catch {
      setState("error");
      setError("Impossible de reactiver la camera.");
    }
  }, [open]);

  const close = useCallback(() => {
    stopStream();
    setState("idle");
    setError("");
    setDetectedCategories([]);
    setResults([]);
    setActiveSearchTerm("");
    setCapturedImage("");
    setLoadingStage("init");
    setAnalyzingStage("capturing");
  }, [stopStream]);

  // Assign stream to video element once it's rendered in viewfinder state
  // Uses retry interval to handle AnimatePresence exit delay
  useEffect(() => {
    if (state !== "viewfinder") return;

    const attach = () => {
      if (videoRef.current && streamRef.current && !videoRef.current.srcObject) {
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.play().catch(() => {});
        return true;
      }
      return false;
    };

    if (attach()) return;

    const interval = setInterval(() => {
      if (attach()) clearInterval(interval);
    }, 100);

    return () => clearInterval(interval);
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
    loadingStage,
    analyzingStage,
    detectedCategories,
    activeSearchTerm,
    results,
    searchLoading,
    capturedImage,
    videoRef,
    connectVideoRef,
    canvasRef,
    open,
    capture,
    retake,
    close,
    searchProducts,
  };
};
