$(document).ready(function() {
    // Initialize the carousel
    $(".carousel").slick({
      infinite: true,
      slidesToShow: 5,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
      centerMode: true,
      variableWidth: true,
      dots: true, // Add dots for navigation
      arrows: true // Add arrows for navigation
    });
  });
  
  const searchButton = document.getElementById("search");
  const charactersDiv = document.getElementById("characters");
  const carouselDiv = document.querySelector(".carousel");
  
  searchButton.addEventListener("click", async () => {
    const animeName = document.getElementById("animeName").value.trim();
  
    if (animeName === "") {
      alert("Please enter an anime name.");
      return;
    }
  
    // Show loading indicator
    charactersDiv.innerHTML = "<p>Loading...</p>";
    carouselDiv.innerHTML = "";
  
    try {
      // Step 1: Get Anime ID
      const animeRes = await fetch(`https://api.jikan.moe/v4/anime?q=${animeName}`);
      const animeData = await animeRes.json();
  
      if (animeData.data.length === 0) {
        charactersDiv.innerHTML = "<p>Anime not found!</p>";
        return;
      }
  
      const animeId = animeData.data[0].mal_id;
  
      // Step 2: Get Characters of that Anime
      const charRes = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/characters`);
      const charData = await charRes.json();
  
      if (charData.data.length === 0) {
        charactersDiv.innerHTML = "<p>No characters found!</p>";
        return;
      }
  
      // Step 3: Display characters & Add to Carousel
      charactersDiv.innerHTML = "";
      charData.data.slice(0, 10).forEach(character => {
        // Flip Card
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <div class="card-inner">
            <div class="card-front">
              <img src="${character.character.images.jpg.image_url}" alt="${character.character.name}">
              <p>${character.character.name}</p>
            </div>
            <div class="card-back" style="background-image: url(${character.character.images.jpg.image_url});">
              <p><strong>${animeData.data[0].title}</strong></p>
              <p>Role: ${character.role}</p>
              <p>${character.character.name} is an important character in ${animeData.data[0].title}.</p>
            </div>
          </div>
        `;
        charactersDiv.appendChild(card);
  
        // Carousel
        const carouselItem = document.createElement("div");
        carouselItem.innerHTML = `<img src="${character.character.images.jpg.image_url}" alt="${character.character.name}">`;
        carouselDiv.appendChild(carouselItem);
      });
  
      // Reinitialize carousel after adding new items
      $(".carousel").slick("refresh");
  
    } catch (error) {
      charactersDiv.innerHTML = "<p>Failed to load characters. Please try again later.</p>";
      console.error(error);
    }
  });