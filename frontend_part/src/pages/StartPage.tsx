import React, { useState, useEffect } from "react";
import "../fonts.css";
import "./StartPage.css";
import UnlockedContent from "../components/UnlockedContent";
import ImageProcessing from "../components/ImageProcessing";
import { useNavigate } from "react-router-dom";
import FlowerDetails, { FlowerType } from "../components/FlowerDetails";
import { useRef } from "react";
import Slider from "react-slick";

interface FlowerDetailsProps {
  flower: FlowerType;
  onBack: () => void;
  onNext?: () => void;
}

interface Prediction {
  id: string;
  name: string;
  image_path: string;
  probability: number;
}

const StartPage = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<{ file: File; dataUrl: string } | null>(null);

  const [flowerIndex, setFlowerIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  const [predictedFlowers, setPredictedFlowers] = useState<Prediction[]>([]);
  const [flowerDetails, setFlowerDetails] = useState<FlowerType[]>([]);
  const [selectedFlower, setSelectedFlower] = useState<FlowerType | null>(null);
  const [showFlowerDetails, setShowFlowerDetails] = useState(false);
  const sliderRef = useRef<Slider>(null);

  const lastSelectedIndexRef = useRef<number>(0);

const fetchFlowerById = async (id: string): Promise<FlowerType | null> => {
  try {
    const response = await fetch(`http://localhost:5000/api/flower/${id}`);
    if (!response.ok) throw new Error("Failed to fetch flower details");
    const data: FlowerType = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Fetch flower by ID error:", error);
    return null;
  }
};


const predictFlower = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file); 

  try {
    const response = await fetch(
      "http://localhost:5000/api/predict",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Prediction failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Prediction error:", error);
    throw error;
  }
};


  const handleImageUpload = async (file: File, imageDataUrl: string) => {
  const imageData = { file, dataUrl: imageDataUrl };
  setUploadedImage(imageData);

   // 🔹 Пушимо стан у історію
  window.history.pushState(
    { 
      unlocked: true,
      imageUploaded: true,
      showFlowerDetails: false, // ⚡ карусель
      imageDataUrl: imageDataUrl,
      fileName: file.name
    },
    '',
    window.location.pathname
  );

  console.log("📸 Photo uploaded:", file.name);

  // 🌸 ML prediction
    try {
      const prediction = await predictFlower(file);
      console.log("🌼 Prediction result:", prediction);

      setPredictedFlowers(prediction);

      // отримуємо деталі квітів по ID
      const flowersDetails = await Promise.all(
        prediction.map((flower: { id: string }) => fetchFlowerById(flower.id))
      );

      // фільтруємо null на випадок помилок
      const validFlowers = flowersDetails.filter(f => f !== null);

      // 🌸 Мапінг даних у формат, який очікує FlowerDetails
        const mappedFlowers = validFlowers.map(f => ({
          id: f.id,
          nameUa: f.nameUa || f.name || "",
          nameLat: f.nameLat || f.name || "",
          imagePath: f.imagePath || f.image_path || "",
          description: f.description || "",
          symbolics: f.symbolics || "",
          inspectRecomendations: f.inspectRecomendations || "",
          colors: f.colors || [],
          meaning: f.meaning || ""
        }));

      console.log("🌸 Mapped Flowers details:", mappedFlowers);

      // автоматично обираємо першу квітку для FlowerDetails
      setPredictedFlowers(prediction);  
      setFlowerDetails(mappedFlowers);


    } catch {
      console.warn("Prediction or fetching details failed");
    }

};


useEffect(() => {
  if (!window.history.state) {
    window.history.replaceState({ unlocked: false, flowerId: null }, '', window.location.pathname);
  }
}, []);

const goToNextFlower = () => {
  if (!selectedFlower || flowerDetails.length === 0) return;

  const currentIndex = flowerDetails.findIndex(f => f.id === selectedFlower.id);
  const nextIndex = (currentIndex + 1) % flowerDetails.length;

  setSelectedFlower(flowerDetails[nextIndex]);
};

const handleUnlock = () => {
  setIsUnlocked(true);
  // Додаємо запис в історію браузера
  window.history.pushState(
    { unlocked: true },
    '',
    window.location.pathname
  );
};

const handleFlowerSelect = (flower: FlowerType) => {
  setSelectedFlower(flower);
  setShowFlowerDetails(true);

  const index = flowerDetails.findIndex(f => f.id === flower.id);

  // пушимо стан у історію
  window.history.pushState(
    {
      unlocked: true,
      uploadedImage: true,
      showFlowerDetails: true,
      selectedFlower: flower,
      flowerDetails: flowerDetails,
      selectedFlowerIndex: index, // ⚡ зберігаємо індекс обраної квітки
      flowerId: flower.id,
      imageDataUrl: uploadedImage?.dataUrl,
      fileName: uploadedImage?.file.name
    },
    '',
    window.location.pathname
  );
};


useEffect(() => {
  const handlePopState = (event: PopStateEvent) => {
    const state = event.state;
    if (!state) return;

    setIsUnlocked(!!state.unlocked);

    if (state.uploadedImage) {
      setUploadedImage({
        file: new File([], state.fileName || "image"),
        dataUrl: state.imageDataUrl,
      });
    }

    setSelectedFlower(state.selectedFlower ?? null);
    setShowFlowerDetails(!!state.showFlowerDetails);

    if (state.flowerDetails) {
      setFlowerDetails(state.flowerDetails);
      lastSelectedIndexRef.current = state.selectedFlowerIndex ?? 0;
    }
  };

  window.addEventListener("popstate", handlePopState);
  return () => window.removeEventListener("popstate", handlePopState);
}, []);


useEffect(() => {
  if (sliderRef.current && flowerDetails.length > 0) {
    sliderRef.current.slickGoTo(lastSelectedIndexRef.current, true);
  }
}, [flowerDetails]);




// 🔐 Stub: пізніше тут буде запит до бекенду
const checkUserAuth = async (): Promise<boolean> => {
  // TODO: replace with backend request
  // return true — user is registered
  // return false — user is NOT registered

  return false; // зараз завжди "незареєстрований"
};




  return (
    <div className="element">
      <div className="element-wrapper">
      <img className="vector" alt="Vector" src="/line.svg" />

      <div
        className="text-wrapper"
        style={{
          cursor: "pointer",
          zIndex: 10000,
        }}
        onClick={() => {
          const token = localStorage.getItem("token");
          if (token) {
            navigate("/profile"); // користувач увійшов
          } else {
            navigate("/auth"); // не авторизований
          }
        }}
      >
        PROFILE
      </div>




      {!isUnlocked && (
        <p className="div">
          Upload a bloom and discover the secret hidden within it
        </p>
      )}

      {!isUnlocked && (
        <p className="welcome-to-the">
          <span className="span">Welcome to the </span>

          <span className="text-wrapper-2">Secret Garden</span>

          <span className="span">
            {" "}
            — a place where blooms reveal more than meets the eye
          </span>
        </p>
      )}

      <div className="text-wrapper-3">MESSAGE</div>

      <div className="text-wrapper-4">ABOUT US</div>

      <div className="text-wrapper-5">CATALOG</div>

      <div className="group">
        <div className="get-advice">GET ADVICE</div>

        <div className="rectangle" />
      </div>

      <img
        className="img"
        alt="Group"
        src="/logo.png"
        style={{ 
          cursor: "pointer",
          zIndex: 9999, // щоб точно не перекривало
        }}
        onClick={() => {
          console.log("Logo clicked"); // перевірка спрацьовування
          setIsUnlocked(false);
          setUploadedImage(null);
          setSelectedFlower(null);
          setFlowerIndex(null);
          window.history.pushState({ unlocked: false, flowerId: null }, '', window.location.pathname);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />



      {!isUnlocked ? (
        <div className="startPage">
          <div className="text-wrapper-6">FLO</div>

          <div className="text-wrapper-7">ERS</div>

          <div className="text-wrapper-8">NLOCK</div>

          <img
            className="aeedb-a"
            alt="Aeedb a"
            src="/start-1.png"
          />

          <div className="text-wrapper-9">W</div>

          <div className="text-wrapper-10">U</div>

          <div className="group-2">
            <div className="text-wrapper-11">O</div>

            <div className="text-wrapper-12">T</div>
          </div>

          <div className="group-3">
            <div className="text-wrapper-13">Y</div>

            <div className="text-wrapper-14">U</div>

            <div className="text-wrapper-15">O</div>
          </div>

          <img
            className="aeedb-a-2"
            alt="Aeedb a"
            src="/start-2.png"
          />

          <button className="group-4" type="button" onClick={handleUnlock}>
            <div className="ellipse" />

            <div className="unlock">UNLOCK</div>
          </button>
        </div>
      ) : uploadedImage ? (
        showFlowerDetails && selectedFlower ? (
        <FlowerDetails
            flower={selectedFlower!}
            onBack={() => {
              // ❌ Повернення з FlowerDetails до каруселі
              setShowFlowerDetails(false);
              setSelectedFlower(null);

              // 🔹 Зберігаємо останній індекс квітки, щоб carousel знав, яку показати центральною
              if (selectedFlower && flowerDetails.length > 0) {
                const index = flowerDetails.findIndex(f => f.id === selectedFlower.id);
                if (index >= 0) lastSelectedIndexRef.current = index;
              }

            }}
            onNext={goToNextFlower}
          />


          ) : (
            <ImageProcessing
              imageData={uploadedImage}
              predictions={flowerDetails}
              sliderRef={sliderRef}
              onFlowerSelect={(flower) => {
                setSelectedFlower(flower); // обираємо квітку
                setShowFlowerDetails(true); // відкриваємо FlowerDetails
              }}
              initialSlide={lastSelectedIndexRef.current}
            />
          )
      ) : (
        <UnlockedContent onImageUpload={handleImageUpload} />
      )}
      </div>
    </div>
  );
};

export default StartPage;
