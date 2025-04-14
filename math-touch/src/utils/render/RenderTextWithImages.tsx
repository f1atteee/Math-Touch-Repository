import React from "react";

interface Image {
  id: number;
  data: string;
}

export const renderTextWithImages = (text: string, images?: Image[]): JSX.Element => {
  if (!images || images.length === 0) {
    return <p>{text}</p>;
  }

  const regex = /ФОТО(\d+)/g;
  const parts: React.ReactNode[] = [];

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const matchIndex = match.index;
    const photoIndex = Number(match[1]);

    // Додаємо текст перед фото
    if (lastIndex < matchIndex) {
      parts.push(<p key={`text-before-${lastIndex}`}>{text.substring(lastIndex, matchIndex)}</p>);
    }

    // Знаходимо зображення по ID
    const image = images.find((img) => img.id === photoIndex);
    if (image && image.data) {
      // Перевірка правильності base64
      console.log(image.data);

      parts.push(
        <React.Fragment key={`image-${photoIndex}`}>
          <br /> {/* Додаємо новий рядок перед зображенням */}
          <img
            key={`image-${photoIndex}`}
            src={image.data}
            alt={`ФОТО${photoIndex}`}
            style={{ maxWidth: "100%", margin: "10px 0" }}
          />
          <br /> {/* Додаємо новий рядок після зображення */}
        </React.Fragment>
      );
    } else {
      parts.push(<p key={`photo-text-${photoIndex}`}>ФОТО{photoIndex}</p>);
    }

    lastIndex = regex.lastIndex;
  }

  // Додаємо залишок тексту
  if (lastIndex < text.length) {
    parts.push(<p key={`text-after-${lastIndex}`}>{text.substring(lastIndex)}</p>);
  }

  return <>{parts}</>; // ⬅️ Фрагмент, а не <p>
};
