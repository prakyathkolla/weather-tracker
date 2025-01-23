import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";

interface LocationSearchProps {
  onSearch: (location: string) => void;
  onUseCurrentLocation: () => void;
}

export const LocationSearch = ({ onSearch, onUseCurrentLocation }: LocationSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2 mb-4">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Search location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/10 backdrop-blur-md border-0 focus-visible:ring-2 focus-visible:ring-white/20"
        />
        <Button
          type="submit"
          size="icon"
          className="absolute right-1 top-1 bg-transparent hover:bg-white/10"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
      <Button
        type="button"
        onClick={onUseCurrentLocation}
        variant="outline"
        className="bg-white/10 hover:bg-white/20"
      >
        <MapPin className="h-4 w-4 mr-2" />
        Current Location
      </Button>
    </form>
  );
};