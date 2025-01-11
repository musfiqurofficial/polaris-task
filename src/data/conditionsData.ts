import { CartIcon, CollectionIcon, ProductIcon } from "@shopify/polaris-icons";

export interface Condition {
  content: string;
  description: string;
  icon?: React.ComponentType;
}

const conditions: Condition[] = [
  {
    content: "Products",
    description: "Specific products in the cart",
    icon: ProductIcon,
  },
  {
    content: "Collections",
    description: "Products from specific collections in the cart",
    icon: CollectionIcon,
  },
  {
    content: "Product tags",
    description: "Products with specific tags in the cart",
    icon: ProductIcon,
  },
  {
    content: "Minimum cart total",
    description: "Minimum required total amount (including tax & shipping)",
    icon: CartIcon,
  },
  // {
  //   content: "Maximum cart total",
  //   description: "Maximum allowed total amount (including tax & shipping)",
  // },
  // {
  //   content: "Minimum cart subtotal",
  //   description: "Minimum required subtotal amount (excluding tax & shipping)",
  // },
  // {
  //   content: "Maximum cart subtotal",
  //   description: "Maximum allowed subtotal amount (excluding tax & shipping)",
  // },
  // {
  //   content: "Minimum total quantity",
  //   description: "Minimum required total quantity",
  // },
];

export default conditions;
