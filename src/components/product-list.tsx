import {Product} from '@/app/page';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';

interface ProductListProps {
  products: Product[];
}

export const ProductList: React.FC<ProductListProps> = ({products}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>Product</CardTitle>
            <CardDescription>${product.price}</CardDescription>
          </CardHeader>
          <CardContent>
            <img src={product.imageUrl} alt="Product Image" className="mb-4 rounded-md" />
            <p>{product.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
