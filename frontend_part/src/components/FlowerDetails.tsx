import React from "react";
import "./FlowerDetails.css";

export interface FlowerType {
  id: string;
  nameUa: string;
  nameLat: string;
  imagePath: string;
  description: string;
  symbolics?: string;
  inspectRecomendations?: string;
  colors?: string[];
  meaning?: string;
}

interface FlowerDetailsProps {
  flower: FlowerType;
  onBack: () => void;
  onNext?: () => void;
}

const FlowerDetails: React.FC<FlowerDetailsProps> = ({ flower, onBack, onNext }) => {
   if (!flower) return null;

   

  const firstLetter = flower.nameLat?.charAt(0) || "";
  const restLetters = flower.nameLat?.slice(1) || "";

  function replaceUkrainianLetters(text: string) {
  return text
    .replace(/о/g, "o")
    .replace(/а/g, "a")
    .replace(/е/g, "e");
}

  return (
    <div className="flower-details">
      

    <div className="flower-details-row">

      {/* Ліва частина: зображення + латинська назва */}
      <div className="flower-content">
        <div className="flower-image-wrapper">
          <img className="rectangle-flowerdetail" src={flower.imagePath} alt={flower.nameUa}/>
          <img
            className="flower-overlay-button"
            src="/overlay-button.png"
            alt="Action"
            onClick={() => console.log("overlay clicked")}
          />
          <img
            className="flower-decorative"
            src="/decorative1.png"
            alt="Decorative"
          />
        </div>

      <div className="latin-name">
        <span className="latin-first">{firstLetter}</span>
        <span className="latin-rest">{restLetters}</span>
      </div>
      </div>
      </div>

      {/* Права частина */}
      <div className="flower-info-right">
        <h2 className="flower-ukrainian-name">
           {(() => {
              const upperName = flower.nameUa.toUpperCase();
              const specialMap: Record<string, string> = {
                "О": "O",
                "А": "A",
                "Е": "E",
                "І": "I"
              };

              // Знайдемо всі індекси спеціальних літер
              const specialIndices = upperName.split("").map((char, idx) => specialMap[char] ? idx : -1).filter(i => i !== -1);

              let replaceIndex = -1;
              if (specialIndices.length > 0) {
                // беремо літеру, що ближче до середини назви
                const middle = Math.floor(upperName.length / 2);
                replaceIndex = specialIndices.reduce((prev, curr) =>
                  Math.abs(curr - middle) < Math.abs(prev - middle) ? curr : prev
                , specialIndices[0]);
              }

              return upperName.split("").map((char, index) => {
                let displayChar = char;

                // замінюємо лише ту літеру, яку обрали
                if (index === replaceIndex) {
                  displayChar = specialMap[char];
                }

                const isSpecial = index === replaceIndex; // тільки для цієї літери
                return (
                  <span key={index} className={isSpecial ? "special-letter" : "normal-letter"}>
                    {displayChar}
                  </span>
                );
              });
           })()}
        </h2>
        {/* Опис */}
        <p className="flower-description">{flower.description}</p>

         {/* Символіка */}
          <p className="flower-symbolism">{flower.symbolics} {flower.meaning}</p>

          {/* Особливості догляду */}
          <p className="flower-care"><strong>Особливості догляду:</strong> {flower.inspectRecomendations}</p>

          {/* Кольори */}
          <div className="flower-colors">
            <strong className="color-names">Кольори:</strong>
            <div className="color-circles">
              {flower.colors && flower.colors.length > 0 ? (
                flower.colors.map((color, idx) => (
                  <span
                    key={idx}
                    className="color-circle"
                    style={{ backgroundColor: color }}
                  />
                ))
              ) : (
                <span>— Немає даних</span>
              )}
            </div>
          </div>


        {/* Декоративне зображення у правому нижньому куті */}
        <img
          className="flower-bg-image"
          src="/decorative2.png"
          alt="Decorative"
        />

        {/* Тільки стрілка "Next" */}
          <div className="flower-navigation">
            <button className="nav-arrow nav-next" onClick={onNext}>
              <img className="nav-arrow-arrow-right" src="/arrow-right.png" alt="Next" />
            </button>
          </div>

      </div>


    </div>
  );
};

export default FlowerDetails;
