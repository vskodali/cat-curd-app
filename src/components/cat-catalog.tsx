"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  ClockIcon,
  HeartIcon,
  MapPinIcon,
  PawPrintIcon,
  PencilIcon,
  PlusIcon,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { toast } from "sonner";

export function CatCatalog() {
  const [cats, setCats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [editingCat, setEditingCat] = useState(null);
  const [filteredCats, setFilteredCats] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [catsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBreed, setSelectedBreed] = useState("all");

  useEffect(() => {
    // Fetch cats from the backend
    const fetchCats = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/cats");
        const data = await response.json();
        setCats(data);
        setFilteredCats(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching cats:", error);
        toast.error("Failed to fetch cats");
      }
    };
    fetchCats();
  }, []);

  const handleAddToFavorites = async (cat) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/cats/${cat.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ favorite: true }),
      });
      if (!response.ok) {
        throw new Error("Failed to add to favorites");
      }
      const updatedCat = await response.json();
      setCats(cats.map((c) => (c.id === cat.id ? updatedCat : c)));
      setFilteredCats(
        filteredCats.map((c) => (c.id === cat.id ? updatedCat : c))
      );
      toast.success("Cat added to favorites");
    } catch (error) {
      console.error("Error adding to favorites:", error);
      toast.error("Failed to add to favorites");
    }
  };

  const handleRemoveFromFavorites = async (cat) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/cats/${cat.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ favorite: false }),
      });
      if (!response.ok) {
        throw new Error("Failed to remove from favorites");
      }
      const updatedCat = await response.json();
      setCats(cats.map((c) => (c.id === cat.id ? updatedCat : c)));
      setFilteredCats(
        filteredCats.map((c) => (c.id === cat.id ? updatedCat : c))
      );
      toast.success("Cat removed from favorites");
    } catch (error) {
      console.error("Error removing from favorites:", error);
      toast.error("Failed to remove from favorites");
    }
  };

  const handleAddCat = async (newCat) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/cats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...newCat, image_url: "/placeholder.svg" }),
      });
      if (!response.ok) {
        throw new Error("Failed to add cat");
      }
      const addedCat = await response.json();
      setCats([...cats, addedCat]);
      setFilteredCats([...filteredCats, addedCat]);
      toast.success("Cat added successfully");
    } catch (error) {
      console.error("Error adding cat:", error);
      toast.error("Failed to add cat");
    }
  };

  const handleUpdateCat = async (updatedCat) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/cats/${updatedCat.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCat),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update cat");
      }
      const updatedCatFromDb = await response.json();
      setCats(cats.map((c) => (c.id === updatedCat.id ? updatedCatFromDb : c)));
      setFilteredCats(
        filteredCats.map((c) => (c.id === updatedCat.id ? updatedCatFromDb : c))
      );
      toast.success("Cat updated successfully");
    } catch (error) {
      console.error("Error updating cat:", error);
      toast.error("Failed to update cat");
    }
  };

  const handleDeleteCat = async (catId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/cats/${catId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete cat");
      }
      setCats(cats.filter((c) => c.id !== catId));
      setFilteredCats(filteredCats.filter((c) => c.id !== catId));
      toast.success("Cat deleted successfully");
    } catch (error) {
      console.error("Error deleting cat:", error);
      toast.error("Failed to delete cat");
    }
  };

  const handleFilterByBreed = (breed) => {
    setSelectedBreed(breed);
    if (breed === "all") {
      setFilteredCats(cats);
    } else {
      setFilteredCats(cats.filter((c) => c.breed === breed));
    }
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setFilteredCats(
      cats.filter(
        (c) =>
          c.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
          c.breed.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
    setCurrentPage(1);
  };

  const indexOfLastCat = currentPage * catsPerPage;
  const indexOfFirstCat = indexOfLastCat - catsPerPage;
  const currentCats = filteredCats.slice(indexOfFirstCat, indexOfLastCat);
  const totalPages = Math.ceil(filteredCats.length / catsPerPage);
  const favoriteCats = filteredCats.filter((cat) => cat.favorite);
  const currentFavCats = favoriteCats.slice(indexOfFirstCat, indexOfLastCat);
  const totalFavPages = Math.ceil(favoriteCats.length / catsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const uniqueBreeds = [...new Set(cats.map((cat) => cat.breed))];
  if (isLoading) {
    return (
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <span className=" self-center justify-center">Loading</span>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Cat Catalog</h1>
      <Tabs defaultValue="all">
        {/* <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <TabsList>
                <TabsTrigger value="all">All Cats</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
              </TabsList>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add New Cat
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="sm:max-w-[425px]">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Add New Cat</AlertDialogTitle>
                    <AlertDialogDescription>
                      Enter the details of the new cat you want to add to the
                      record.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        className="col-span-3"
                        onChange={(e) =>
                          setEditingCat({ ...editingCat, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        className="col-span-3"
                        onChange={(e) =>
                          setEditingCat({
                            ...editingCat,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="breed" className="text-right">
                        Breed
                      </Label>
                      <Input
                        id="breed"
                        className="col-span-3"
                        onChange={(e) =>
                          setEditingCat({ ...editingCat, breed: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="origin" className="text-right">
                        Origin
                      </Label>
                      <Input
                        id="origin"
                        className="col-span-3"
                        placeholder="Country or region of origin"
                        onChange={(e) =>
                          setEditingCat({
                            ...editingCat,
                            origin: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="lifespan" className="text-right">
                        Lifespan
                      </Label>
                      <Input
                        id="lifespan"
                        className="col-span-3"
                        placeholder="Average lifespan (e.g., 12-15 years)"
                        onChange={(e) =>
                          setEditingCat({
                            ...editingCat,
                            life_span: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="favorite" className="text-right">
                        Favorite
                      </Label>
                      <Checkbox
                        id="favorite"
                        onCheckedChange={(checked) =>
                          setEditingCat({ ...editingCat, favorite: checked })
                        }
                      />
                    </div>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleAddCat(editingCat)}>
                      Save
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div className="flex gap-2">
              <Select value={selectedBreed} onValueChange={handleFilterByBreed}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Breed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {uniqueBreeds.map((breed) => (
                    <SelectItem key={breed} value={breed}>
                      {breed}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                className="w-32"
                type="text"
                placeholder="Search by name or breed"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div> */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="all" className="flex-grow sm:flex-grow-0">
                All Cats
              </TabsTrigger>
              <TabsTrigger
                value="favorites"
                className="flex-grow sm:flex-grow-0"
              >
                Favorites
              </TabsTrigger>
            </TabsList>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add New Cat
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-[95vw] max-w-[425px]">
                <AlertDialogHeader>
                  <AlertDialogTitle>Add New Cat</AlertDialogTitle>
                  <AlertDialogDescription>
                    Enter the details of the new cat you want to add to the
                    record.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid gap-4 py-4">
                  {/* Form fields remain the same */}
                  {/* ... */}
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleAddCat(editingCat)}>
                    Save
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Select value={selectedBreed} onValueChange={handleFilterByBreed}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select Breed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {uniqueBreeds.map((breed) => (
                  <SelectItem key={breed} value={breed}>
                    {breed}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              className="w-full sm:w-[200px]"
              type="text"
              placeholder="Search by name or breed"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        <TabsContent value="all">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCats.map((cat) => (
              <Card key={cat.id} className="relative">
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  width={400}
                  height={400}
                  className="w-full h-60 object-cover rounded-t-lg"
                />
                <CardContent className="p-6 grid gap-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">{cat.name}</h2>
                    <div className="flex items-center gap-2">
                      {cat.favorite ? (
                        <HeartIcon
                          className="w-6 h-6 fill-primary        cursor-pointer"
                          onClick={() => handleRemoveFromFavorites(cat)}
                        />
                      ) : (
                        <HeartIcon
                          className="w-6 h-6 text-gray-400 cursor-pointer"
                          onClick={() => handleAddToFavorites(cat)}
                        />
                      )}
                    </div>
                  </div>
                  <p className="text-muted-foreground">{cat.description}</p>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="w-5 h-5" />
                      <span>{cat.origin}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PawPrintIcon className="w-5 h-5" />
                      <span>{cat.breed}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-5 h-5" />
                      <span>{cat.life_span} years</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button>
                        <PencilIcon className="w-4 h-4 mr-2" />
                        Update Cat Details
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="sm:max-w-[425px]">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Update Cat Details</AlertDialogTitle>
                        <AlertDialogDescription>
                          Modify the information for the selected cat. Fields
                          left blank will retain their current values.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Name
                          </Label>
                          <Input
                            id="name"
                            className="col-span-3"
                            placeholder="Enter cat's name"
                            defaultValue={cat.name}
                            onChange={(e) =>
                              setEditingCat({
                                ...editingCat,
                                name: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="description" className="text-right">
                            Description
                          </Label>
                          <Textarea
                            id="description"
                            className="col-span-3"
                            placeholder="Describe the cat"
                            defaultValue={cat.description}
                            onChange={(e) =>
                              setEditingCat({
                                ...editingCat,
                                description: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="breed" className="text-right">
                            Breed
                          </Label>
                          <Input
                            id="breed"
                            className="col-span-3"
                            placeholder="Cat's breed"
                            defaultValue={cat.breed}
                            onChange={(e) =>
                              setEditingCat({
                                ...editingCat,
                                breed: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="lifespan" className="text-right">
                            Lifespan
                          </Label>
                          <Input
                            id="lifespan"
                            className="col-span-3"
                            placeholder="Average lifespan (e.g., 12-15 years)"
                            defaultValue={cat.life_span}
                            onChange={(e) =>
                              setEditingCat({
                                ...editingCat,
                                lifespan: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="origin" className="text-right">
                            Origin
                          </Label>
                          <Input
                            id="origin"
                            className="col-span-3"
                            placeholder="Country or region of origin"
                            defaultValue={cat.origin}
                            onChange={(e) =>
                              setEditingCat({
                                ...editingCat,
                                origin: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="favorite" className="text-right">
                            Favorite
                          </Label>
                          <div className="col-span-3 flex items-center space-x-2">
                            <Checkbox
                              id="favorite"
                              defaultChecked={cat.favorite}
                              onCheckedChange={(checked) =>
                                setEditingCat({
                                  ...editingCat,
                                  favorite: checked,
                                })
                              }
                            />
                            <Label htmlFor="favorite">Mark as favorite</Label>
                          </div>
                        </div>
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleUpdateCat}>
                          Update
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button
                    size="sm"
                    variant="outline"
                    className="ml-2"
                    onClick={() => handleDeleteCat(cat.id)}
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <Pagination className="mt-6" currentPage={currentPage}>
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
            />
            <PaginationContent>
              {[...Array(totalPages).keys()].map((page) => (
                <PaginationItem
                  key={page + 1}
                  isCurrent={page + 1 === currentPage}
                >
                  <PaginationLink
                    isActive={page + 1 === currentPage}
                    onClick={() => handlePageChange(page + 1)}
                  >
                    {page + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
            </PaginationContent>
            <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
          </Pagination>
        </TabsContent>
        <TabsContent value="favorites">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* {filteredCats
              .filter((cat) => cat.favorite) */}
            {currentFavCats.map((cat) => (
              <Card key={cat.id} className="relative">
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  width={400}
                  height={400}
                  className="w-full h-60 object-cover rounded-t-lg"
                />
                <CardContent className="p-6 grid gap-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">{cat.name}</h2>
                    <div className="flex items-center gap-2">
                      {cat.favorite ? (
                        <HeartIcon
                          className="w-6 h-6 fill-primary        cursor-pointer"
                          onClick={() => handleRemoveFromFavorites(cat)}
                        />
                      ) : (
                        <HeartIcon
                          className="w-6 h-6 text-gray-400 cursor-pointer"
                          onClick={() => handleAddToFavorites(cat)}
                        />
                      )}
                    </div>
                  </div>
                  <p className="text-muted-foreground">{cat.description}</p>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="w-5 h-5" />
                      <span>{cat.origin}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PawPrintIcon className="w-5 h-5" />
                      <span>{cat.breed}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-5 h-5" />
                      <span>{cat.life_span} years</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button>
                        <PencilIcon className="w-4 h-4 mr-2" />
                        Update Cat Details
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="sm:max-w-[425px]">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Update Cat Details</AlertDialogTitle>
                        <AlertDialogDescription>
                          Modify the information for the selected cat. Fields
                          left blank will retain their current values.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Name
                          </Label>
                          <Input
                            id="name"
                            className="col-span-3"
                            placeholder="Enter cat's name"
                            defaultValue={cat.name}
                            onChange={(e) =>
                              setEditingCat({
                                ...editingCat,
                                name: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="description" className="text-right">
                            Description
                          </Label>
                          <Textarea
                            id="description"
                            className="col-span-3"
                            placeholder="Describe the cat"
                            defaultValue={cat.description}
                            onChange={(e) =>
                              setEditingCat({
                                ...editingCat,
                                description: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="breed" className="text-right">
                            Breed
                          </Label>
                          <Input
                            id="breed"
                            className="col-span-3"
                            placeholder="Cat's breed"
                            defaultValue={cat.breed}
                            onChange={(e) =>
                              setEditingCat({
                                ...editingCat,
                                breed: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="lifespan" className="text-right">
                            Lifespan
                          </Label>
                          <Input
                            id="lifespan"
                            className="col-span-3"
                            placeholder="Average lifespan (e.g., 12-15 years)"
                            defaultValue={cat.lifespan}
                            onChange={(e) =>
                              setEditingCat({
                                ...editingCat,
                                lifespan: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="origin" className="text-right">
                            Origin
                          </Label>
                          <Input
                            id="origin"
                            className="col-span-3"
                            placeholder="Country or region of origin"
                            defaultValue={cat.origin}
                            onChange={(e) =>
                              setEditingCat({
                                ...editingCat,
                                origin: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="favorite" className="text-right">
                            Favorite
                          </Label>
                          <div className="col-span-3 flex items-center space-x-2">
                            <Checkbox
                              id="favorite"
                              defaultChecked={cat.favorite}
                              onCheckedChange={(checked) =>
                                setEditingCat({
                                  ...editingCat,
                                  favorite: checked,
                                })
                              }
                            />
                            <Label htmlFor="favorite">Mark as favorite</Label>
                          </div>
                        </div>
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleUpdateCat}>
                          Update
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button
                    size="sm"
                    variant="outline"
                    className="ml-2"
                    onClick={() => handleDeleteCat(cat.id)}
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <Pagination className="mt-6" currentPage={currentPage}>
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            <PaginationContent>
              {[...Array(totalFavPages).keys()].map((page) => (
                <PaginationItem
                  key={page + 1}
                  isCurrent={page + 1 === currentPage}
                >
                  <PaginationLink
                    isActive={page + 1 === currentPage}
                    onClick={() => handlePageChange(page + 1)}
                  >
                    {page + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
            </PaginationContent>
            <PaginationNext
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalFavPages}
            />
          </Pagination>
        </TabsContent>
      </Tabs>
    </div>
  );
}
