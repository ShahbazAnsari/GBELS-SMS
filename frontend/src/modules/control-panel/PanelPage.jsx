import { useNavigate } from "react-router";

function PanelPage({
  title,
  description,
  cards = [],
  children,
}) {
  const navigate = useNavigate();

  return (
    <div className="w-full px-6 pb-6">

      {/* Page Header */}
      {title && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {title}
          </h1>

          {description && (
            <p className="text-gray-500 mt-1">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Cards */}
      {cards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => {
                if (card.path) {
                  navigate(card.path);
                }
              }}
              className={`bg-white p-6 rounded-xl shadow transition ${
                card.path
                  ? "cursor-pointer hover:shadow-lg"
                  : "opacity-75"
              }`}
            >
              <div className="text-3xl mb-3">
                {card.icon}
              </div>

              <h2 className="text-lg font-semibold text-gray-800">
                {card.title}
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Child Content */}
      {children}
    </div>
  );
}

export default PanelPage;
