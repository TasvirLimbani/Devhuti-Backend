"use client"

import { useState, Suspense } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Package, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import { ProductDialog } from "@/components/dashboard/product-dialog"
import { DeleteConfirmDialog } from "@/components/dashboard/delete-confirm-dialog"
import Loading from "../customers/loading"

interface Product {
  id: number
  name: string
  sku: string
  category: string
  price: number
  stock: number
  status: "Active" | "Inactive"
  image?: string
  createdDate: string
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Adidas Ultraboost Running Shoe",
    sku: "ADI-001",
    category: "Footwear",
    price: 179.99,
    stock: 45,
    status: "Active",
    image: "/adidas-ultraboost-running-shoe.jpg",
    createdDate: "Jan 15, 2024",
  },
  {
    id: 2,
    name: "Samsung Galaxy Watch",
    sku: "SAM-002",
    category: "Electronics",
    price: 299.99,
    stock: 23,
    status: "Active",
    image: "/samsung-galaxy-watch-smartwatch.jpg",
    createdDate: "Feb 10, 2024",
  },
  {
    id: 3,
    name: "Sony WH1000XM5 Headphones",
    sku: "SONY-001",
    category: "Audio",
    price: 399.99,
    stock: 12,
    status: "Active",
    image: "/sony-wh1000xm5-headphones.jpg",
    createdDate: "Jan 20, 2024",
  },
  {
    id: 4,
    name: "Apple AirPods Pro",
    sku: "APPLE-001",
    category: "Audio",
    price: 249.99,
    stock: 0,
    status: "Inactive",
    image: "/apple-airpods-pro-earbuds.jpg",
    createdDate: "Dec 05, 2023",
  },
  {
    id: 5,
    name: "Nike React Running Shoe",
    sku: "NIKE-001",
    category: "Footwear",
    price: 129.99,
    stock: 67,
    status: "Active",
    createdDate: "Mar 01, 2024",
  },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddProduct = () => {
    setEditingProduct(null)
    setIsDialogOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setIsDialogOpen(true)
  }

  const handleSaveProduct = (formData: any) => {
    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...editingProduct,
                ...formData,
                id: editingProduct.id,
              }
            : p
        )
      )
    } else {
      const newProduct: Product = {
        ...formData,
        id: Math.max(...products.map((p) => p.id), 0) + 1,
        createdDate: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      }
      setProducts([...products, newProduct])
    }
    setIsDialogOpen(false)
    setEditingProduct(null)
  }

  const handleToggleStatus = (id: number) => {
    setProducts(
      products.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "Active" ? "Inactive" : "Active" }
          : p
      )
    )
  }

  const handleDeleteClick = (id: number) => {
    setDeleteProductId(id)
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    if (deleteProductId) {
      setProducts(products.filter((p) => p.id !== deleteProductId))
    }
    setShowDeleteDialog(false)
    setDeleteProductId(null)
  }

  const getStatusColor = (status: string) => {
    return status === "Active"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800"
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Footwear: "bg-blue-100 text-blue-800",
      Electronics: "bg-purple-100 text-purple-800",
      Audio: "bg-amber-100 text-amber-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  return (
    <Suspense fallback={<Loading />}>
      <>
        <PageHeader
          title="Products"
          description="Manage your product catalog and inventory."
        >
          <Button
            onClick={handleAddProduct}
            className="flex items-center gap-2 bg-foreground text-background hover:bg-foreground/90"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </PageHeader>

        {/* Product Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-card border border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Products</span>
                <div className="p-2 bg-muted rounded-lg">
                  <Package className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <p className="text-3xl font-semibold">{products.length}</p>
              <p className="text-xs text-green-600 mt-1">
                {products.filter((p) => p.status === "Active").length} active
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card border border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Total Stock Value
                </span>
                <div className="p-2 bg-muted rounded-lg">
                  <Package className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <p className="text-3xl font-semibold">
                ${(
                  products.reduce((sum, p) => sum + p.price * p.stock, 0) / 1000
                ).toFixed(1)}
                K
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {products.reduce((sum, p) => sum + p.stock, 0)} units
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card border border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Low Stock Items
                </span>
                <div className="p-2 bg-muted rounded-lg">
                  <Package className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <p className="text-3xl font-semibold">
                {products.filter((p) => p.stock < 20).length}
              </p>
              <p className="text-xs text-amber-600 mt-1">Need restocking</p>
            </CardContent>
          </Card>
          <Card className="bg-card border border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Out of Stock</span>
                <div className="p-2 bg-muted rounded-lg">
                  <Package className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <p className="text-3xl font-semibold">
                {products.filter((p) => p.stock === 0).length}
              </p>
              <p className="text-xs text-red-600 mt-1">Unavailable</p>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="bg-card border border-border mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 bg-muted rounded-lg px-3">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by product name, SKU, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-0 focus-visible:ring-0 w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card className="bg-card border border-border">
          <CardHeader className="border-b border-border">
            <CardTitle>Products List</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 rounded object-cover"
                            />
                          )}
                          <span className="font-medium text-sm">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {product.sku}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary" className={getCategoryColor(product.category)}>
                          {product.category}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-medium ${
                              product.stock === 0
                                ? "text-red-600"
                                : product.stock < 20
                                  ? "text-amber-600"
                                  : "text-green-600"
                            }`}
                          >
                            {product.stock}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant="secondary"
                          className={getStatusColor(product.status)}
                        >
                          {product.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleStatus(product.id)}
                            title={
                              product.status === "Active"
                                ? "Deactivate product"
                                : "Activate product"
                            }
                          >
                            {product.status === "Active" ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <EyeOff className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteClick(product.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-8">
                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-2 opacity-50" />
                <p className="text-muted-foreground">No products found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Dialog */}
        <ProductDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          product={editingProduct}
          onSave={handleSaveProduct}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={handleConfirmDelete}
          title="Delete Product"
          description="Are you sure you want to delete this product? This action cannot be undone."
        />
      </>
    </Suspense>
  )
}
