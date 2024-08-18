import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
interface Card {
  id: number;
  title: string;
  description: string;
}

const createCard = async (card: Omit<Card, "id">) => {
  const response = await axios.post<Card>("http://localhost:4001/cards", card);
  return response.data;
};
const fetchCards = async (query: string = "") => {
  const response = await axios.get<Card[]>(
    `http://localhost:4001/cards${query ? `/search?query=${query}` : ""}`
  );
  return response.data;
};
const updateCard = async (card: Card) => {
  const response = await axios.put<Card>(
    `http://localhost:4001/cards/${card.id}`,
    card
  );
  return response.data;
};

const deleteCard = async (id: number) => {
  await axios.delete(`http://localhost:4001/cards/${id}`);
};
const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [previewCard, setPreviewCard] = useState<Card | null>(null);
  // Debounce effect for search query
  useEffect(() => {
    const debouncedSearch = debounce(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    debouncedSearch();

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery]);

  const {
    data: cards,
    isLoading,
    isError,
  } = useQuery<Card[]>({
    queryKey: ["cards", debouncedSearchQuery],
    queryFn: () => fetchCards(searchQuery),
  });

  const createCardMutation = useMutation({
    mutationFn: createCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      setIsModalOpen(false);
    },
  });
  const updateCardMutation = useMutation({
    mutationFn: updateCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      setIsModalOpen(false);
      setEditingCard(null);
    },
  });

  const deleteCardMutation = useMutation({
    mutationFn: deleteCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });
  const handleAddCard = () => {
    setEditingCard(null);
    setIsModalOpen(true);
  };

  const handleEditCard = (card: Card) => {
    setEditingCard(card);
    setIsModalOpen(true);
  };

  const handleDeleteCard = (id: number) => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      deleteCardMutation.mutate(id);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCardSubmit = (card: Omit<Card, "id">) => {
    if (editingCard) {
      updateCardMutation.mutate({ ...card, id: editingCard.id });
    } else {
      createCardMutation.mutate(card);
    }
  };
  return (
    <div>
      {/* Header */}
      <header className="w-full bg-black text-white py-4 px-6 flex justify-between items-center">
        <div className="text-lg font-bold">Abstract | Help Center</div>
        <div className="flex flex-row gap-4">
          <button
            className="bg-gray-800 text-white py-2 px-4 rounded"
            onClick={handleAddCard}
          >
            Add New Card
          </button>
          <button className="bg-gray-800 text-white py-2 px-4 rounded">
            Submit a request
          </button>
        </div>
      </header>
      <div className="flex flex-col items-center  min-h-screen bg-gray-100">
        {/* Search Section */}
        <div className="w-full bg-[#DADBF0] py-16">
          <h1 className="text-4xl font-semibold text-center mb-8">
            How can we help?
          </h1>
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search"
              className="w-full p-4 border rounded shadow"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-5xl mx-auto py-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {isLoading ? (
            <p>Loading...</p>
          ) : isError ? (
            <p>Error fetching cards</p>
          ) : searchQuery && !cards?.length ? (
            <p>No cards found matching '{searchQuery}'</p>
          ) : (
            cards?.map((card) => (
              <div
                key={card.id}
                className="p-6 relative bg-white rounded-lg shadow hover:shadow-lg transition duration-300"
              >
                <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
                <p className="text-gray-600">{card.description}</p>
                <div className="absolute top-2 right-2  opacity-0 hover:opacity-100 ">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCard(card);
                    }}
                    className="mr-2 px-2 py-1 bg-blue-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCard(card.id);
                    }}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <CardModal
        isOpen={isModalOpen}
        onClose={() => {
            setIsModalOpen(false)
        }}
        onSubmit={handleCardSubmit}
        initialCard={editingCard || undefined}
      />

      {previewCard && (
        <CardPreview card={previewCard} onClose={() => setPreviewCard(null)} />
      )}
     
    </div>
  );
};

export default HomePage;

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (card: Omit<Card, "id">) => void;
  initialCard?: Card;
}

const CardModal: React.FC<CardModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialCard,
}) => {
  const [title, setTitle] = useState(initialCard?.title || "");
  const [description, setDescription] = useState(
    initialCard?.description || ""
  );
  useEffect(() => {
    setTitle(initialCard?.title || "");
    setDescription(initialCard?.description || "");
  }, [initialCard]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">
          {initialCard ? "Edit Card" : "Add New Card"}
        </h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => {
                setDescription("");
                setTitle("");
                onSubmit({ title, description }

                )}}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {initialCard ? "Save" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

const CardPreview: React.FC<{ card: Card; onClose: () => void }> = ({
  card,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">{card.title}</h2>
        <p className="mb-4">{card.description}</p>
        <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
          Close
        </button>
      </div>
    </div>
  );
};
