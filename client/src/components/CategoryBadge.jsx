const CATEGORY_CLASSES = {
  Frontend: "category-frontend",
  Backend: "category-backend",
  "AI/ML": "category-ai",
  DevOps: "category-devops",
  "Data Engineering": "category-data",
  Other: "category-other",
};

function CategoryBadge({ category = "Other" }) {
  return (
    <span className={`category-badge ${CATEGORY_CLASSES[category] || CATEGORY_CLASSES.Other}`}>
      {category}
    </span>
  );
}

export default CategoryBadge;
