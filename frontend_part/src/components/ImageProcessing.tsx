import React, { useRef, useEffect } from "react";
import Slider from "react-slick";
import "../pages/StartPage.css";
import "./ImageProcessing.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FlowerType } from "../components/FlowerDetails";

interface Prediction {
  id: string;
  name: string;
  image_path: string;
  probability: number;
}

interface ImageProcessingProps {
  imageData: { file: File; dataUrl: string };
  predictions: FlowerType[];   // ✅
  sliderRef: React.RefObject<Slider>;
  onFlowerSelect: (flower: FlowerType) => void; // ✅
  initialSlide?: number;
}

// interface Flower {
//   id: number;
//   name: string;
//   latinName: string;
//   image: string;
//   description: string;
//   symbolism: string;
//   care: string;
//   colors: string[];
// }

// export const flowers: Flower[] = [
//   {
//     id: 1,
//     name: "Гібіскус",
//     latinName: "HIBISCUS",
//     image: "/start-flower-1.png",
//     description: "Пишна та ароматна квітка, що завжди асоціюється з теплом та тропіками. Має яскраві пелюстки та декоративні листя.",
//     symbolism: "Гібіскус символізує красу, дружбу та жіночність. У деяких культурах вважається символом визнання та щастя.",
//     care: "Потребує багато світла, регулярного поливу та теплої температури. Не любить протягів і застою води.",
//     colors: ["#FF6347", "#FFD700"] // червоний, жовтий
//   },
//   {
//     id: 2,
//     name: "Півонія",
//     latinName: "PAEONIA LACTIFLORA",
//     image: "/start-flower-2.png",
//     description: "Пишна та ароматна квітка, що завжди асоціюється з весною. Має шаруваті пелюстки, які створюють ефект м’якої хмари. Популярна в садах та весільній флористиці.",
//     symbolism: "Півонія символізує романтику, багатство, ніжність і щирі почуття. Вважається гарним оберегом для дому.",
//     care: "Потребує багато світла, легкого ґрунту та регулярного зволоження. Не любить частих пересадок.",
//     colors: ["#FFFFFF", "#DB949C"] // білий, ніжно-рожевий
//   },
//   {
//     id: 3,
//     name: "Маргаритка",
//     latinName: "BELLIS PERENNIS",
//     image: "/start-flower-3.png",
//     description: "Невелика та мила квітка з ніжними білими пелюстками та яскраво-жовтою серединкою. Часто використовується у весняних букетах.",
//     symbolism: "Маргаритка символізує чистоту, невинність і щирість. Часто дарується як знак дружби та любові.",
//     care: "Вимоглива до світла, добре росте на сонячних місцях. Потребує регулярного поливу, але не переносить застою води.",
//     colors: ["#FFFFFF", "#FFFF00"] // білий, жовтий
//   },
//   {
//     id: 4,
//     name: "Лаванда",
//     latinName: "LAVANDULA ANGUSTIFOLIA",
//     image: "/start-flower-4.png",
//     description: "Запашна трав’яниста рослина з вузькими листками та ніжно-фіолетовими суцвіттями. Використовується для ароматизації та декору.",
//     symbolism: "Лаванда символізує спокій, чистоту та гармонію. Вважається рослиною для відновлення енергії та зняття стресу.",
//     care: "Потребує сонячного місця, добре дренованого ґрунту та помірного поливу. Не переносить надлишкової вологи.",
//     colors: ["#B497BD", "#E6E6FA"] // фіолетовий, лавандовий
//   },
//   {
//     id: 5,
//     name: "Магнолія",
//     latinName: "MAGNOLIA GRANDIFLORA",
//     image: "/start-flower-5.png",
//     description: "Велика декоративна квітка з товстими пелюстками, що мають насичений аромат. Дуже популярна в садах та парках.",
//     symbolism: "Магнолія символізує велич, стійкість та чистоту. Часто асоціюється з благородством і витонченістю.",
//     care: "Потребує сонячного місця або легкого затінку, родючого ґрунту та регулярного поливу. Морозостійкість середня.",
//     colors: ["#FFFFFF", "#F0E68C"] // білий, світло-жовтий
//   }
// ];


const ImageProcessing: React.FC<ImageProcessingProps> = ({ sliderRef, imageData, onFlowerSelect, predictions, initialSlide = 0  }) => {

  const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  centerMode: true,
  centerPadding: "0px",
  arrows: false,
  swipeToSlide: true,
  initialSlide, // 🔥 завжди з топ-предикту
};


const fetchFlowerDetails = async (id: string) => {
  try {
    const response = await fetch(
      `https://interthronging-spectrologically-penni.ngrok-free.dev/api/Flower/${id}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch flower details");
    }

    const data = await response.json();
    console.log("🌸 Flower details:", data);
  } catch (error) {
    console.error("❌ Error fetching flower details:", error);
  }
};

const goToPrev = () => {
  sliderRef.current?.slickPrev();
};

const goToNext = () => {
  sliderRef.current?.slickNext();
};

useEffect(() => {
  if (sliderRef.current && predictions.length > 0) {
    const index = initialSlide ?? 0;
    sliderRef.current.slickGoTo(index, true);
  }
}, [initialSlide, predictions]);




  return (
    <div className="image-processing">
      <div className="box">
        <div style={{ backgroundImage: "url(/rectangle-2.png)" }} className="group-image"/>
        <div className="text-wrapper-image">Bloom Matches</div>
        
        <div className="flowers-carousel-wrapper">
          <button 
            className="carousel-arrow carousel-arrow-prev" 
            onClick={goToPrev}
            type="button"
            aria-label="Previous slide"
          >
            <img src="/arrow-left.png" alt="Prev" />
          </button>
          
          <div className="flowers-carousel-container">
            <Slider ref={sliderRef} {...settings} className="flowers-carousel">
              {predictions.map((flower) => (
                <div key={flower.id} className="flower-slide-wrapper">
                  <div className="flower-card"
                  onClick={() => {
                        onFlowerSelect(flower); // ✅ передаємо об'єкт в StartPage
                      }}
                  style={{ cursor: "pointer" }}
                  >
                    <div className="flower-image-container">
                      <img 
                        src={flower.imagePath} 
                        alt={flower.nameLat}
                        className="flower-image"
                      />
                    </div>
                    <div className="flower-info">
                      <div className="flower-latin-name">{flower.nameLat}</div>
                      <div className="flower-show-more"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("🆔 Selected flower id:", flower.id);
                        fetchFlowerDetails(flower.id);
                      }}
                      >show more</div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
          
          <button 
            className="carousel-arrow carousel-arrow-next" 
            onClick={goToNext}
            type="button"
            aria-label="Next slide"
          >
            <img src="/arrow-right.png" alt="Next" />
          </button>
        </div>
      </div>
    </div>
  );
};

const CustomPrevArrow = ({ onClick, className, style }: any) => {
  return (
    <button 
      className={`carousel-arrow carousel-arrow-prev ${className || ''}`}
      onClick={onClick}
      type="button"
      style={style}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
};

const CustomNextArrow = ({ onClick, className, style }: any) => {
  return (
    <button 
      className={`carousel-arrow carousel-arrow-next ${className || ''}`}
      onClick={onClick}
      type="button"
      style={style}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
};

export default ImageProcessing;
