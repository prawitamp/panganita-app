import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DetailHeader from "@/components/common/DetailHeader";
import BottomNav from "@/components/common/BottomNav";
import { featuredRecipesData, smallRecipes } from "@/data/recipes";
import { ASSETS, getAssetUrl } from "@/constants/assets";

export default function RecipesScreen({ setScreen }) {
  const router = useRouter();
  const [age, setAge] = useState("9–11 Bulan (Adek Faris)");
  const featured = featuredRecipesData.abonLele;

  const ageFilters = [
    "Semua Usia",
    "9–11 Bulan (Adek Faris)",
    "12–24 Bulan",
  ];

  const handleBack = () => {
    if (setScreen) setScreen("home");
    router.push("/beranda");
  };

  return (
    <main className="detail-page">
      <div className="detail-shell">
        <DetailHeader
          title="Resep MPASI Lokal"
          back={handleBack}
        />

        <div className="filter-row age-filter">
          {ageFilters.map((item) => (
            <button
              className={age === item ? "active" : ""}
              key={item}
              onClick={() => setAge(item)}
            >
              {item}
              {age === item ? <img src={getAssetUrl("39b6c.svg")} alt="" /> : null}
            </button>
          ))}
        </div>

        <div className="recipes-layout">
          <article className="featured-recipe">
            <div className="featured-recipe-image">
              <img src={getAssetUrl(featured.image)} alt={featured.title} />
              <div>
                <span>
                  <img src={getAssetUrl("a3215.svg")} alt="" /> {featured.badge}
                </span>
                <span>{featured.duration}</span>
              </div>
            </div>
            <div className="featured-recipe-body">
              <div className="featured-title">
                <h1>{featured.title}</h1>
                <span>{featured.tag}</span>
              </div>
              <p>{featured.description}</p>
              <div className="ingredient-row">
                {featured.ingredients.map((ing) => (
                  <span key={ing}>{ing}</span>
                ))}
              </div>
              <ol className="recipe-steps">
                {featured.steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
              <button
                className="listen-button"
                onClick={() => setScreen("education")}
              >
                <img src={ASSETS.speakerIcon} alt="" /> Dengarkan Langkah Memasak
              </button>
            </div>
          </article>

          <section className="more-recipes">
            <div className="section-heading">
              <h2>Resep Bergizi Lainnya Hari Ini</h2>
              <span>2 Resep</span>
            </div>

            {smallRecipes.map((recipe) => (
              <article className="small-recipe" key={recipe.title}>
                <img src={getAssetUrl(recipe.image)} alt={recipe.title} />
                <div>
                  <div>
                    <span>{recipe.time}</span>
                    <span>{recipe.tag}</span>
                  </div>
                  <h3>{recipe.title}</h3>
                  <p>{recipe.note}</p>
                </div>
                <button
                  aria-label={`Buka ${recipe.title}`}
                  onClick={() => setScreen("education")}
                >
                  <img src={ASSETS.forwardArrow} alt="" />
                </button>
              </article>
            ))}

            <aside className="kitchen-tip">
              <strong>
                <img src={getAssetUrl("b17a5.svg")} alt="" /> {featured.tipsTitle}
              </strong>
              <p>{featured.tipsContent}</p>
            </aside>

            <aside className="ask-nita">
              <img src={ASSETS.nitaAvatar} alt="Bu Nita" />
              <span>
                <strong>Punya bahan lain di dapur?</strong>
                Tanyakan takaran porsi ke...
              </span>
              <button onClick={() => setScreen("nita-chat")}>
                Tanya <img src={getAssetUrl("22399.svg")} alt="" />
              </button>
            </aside>
          </section>
        </div>

        <BottomNav active={null} setScreen={setScreen} />
      </div>
    </main>
  );
}
