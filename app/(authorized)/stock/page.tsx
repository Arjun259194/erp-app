import { SectionGrid } from "@/components/SectionGrid";

export default function page() {
  const groups = [
    {
      heading: "Quick Access",
      sections: [
        {
          title: "",
          links: [
            { label: "Item", href: "/stock/item" },
            { label: "Material Request", href: "/stock/material-request" },
            { label: "Stock Entry", href: "/stock-entry" },
            { label: "Purchase Receipt", href: "/purchase-receipt" },
            { label: "Delivery Note", href: "/delivery-note" },
            { label: "Stock Ledger", href: "/stock-ledger" },
            { label: "Stock Balance", href: "/stock-balance" },
            { label: "Dashboard", href: "/dashboard" },
            { label: "Learn Inventory Management", href: "/learn" },
          ],
        },
      ],
    },
    {
      heading: "Masters & Reports",
      sections: [
        {
          title: "Items Catalogue",
          links: [
            { label: "Item", href: "/item" },
            { label: "Item Group", href: "/item-group" },
            { label: "Product Bundle", href: "/product-bundle" },
            { label: "Shipping Rule", href: "/shipping-rule" },
            { label: "Item Alternative", href: "/item-alternative" },
            { label: "Item Manufacturer", href: "/item-manufacturer" },
          ],
        },
        {
          title: "Stock Transactions",
          links: [
            { label: "Material Request", href: "/material-request" },
            { label: "Stock Entry", href: "/stock-entry" },
            { label: "Delivery Note", href: "/delivery-note" },
            { label: "Purchase Receipt", href: "/purchase-receipt" },
            { label: "Pick List", href: "/pick-list" },
            { label: "Delivery Trip", href: "/delivery-trip" },
          ],
        },
        {
          title: "Stock Reports",
          links: [
            { label: "Stock Ledger", href: "/stock-ledger" },
            { label: "Stock Balance", href: "/stock-balance" },
            { label: "Stock Projected Qty", href: "/projected-qty" },
            { label: "Stock Summary", href: "/stock-summary" },
            { label: "Stock Ageing", href: "/stock-ageing" },
            { label: "Item Price Stock", href: "/item-price" },
            {
              label: "Warehouse Wise Stock Balance",
              href: "/warehouse-stock-balance",
            },
          ],
        },
        {
          title: "Settings",
          links: [
            { label: "Stock Settings", href: "/stock-settings" },
            { label: "Warehouse", href: "/warehouse" },
            { label: "Unit of Measure (UOM)", href: "/uom" },
            { label: "Item Variant Settings", href: "/item-variant" },
            { label: "Brand", href: "/brand" },
            { label: "Item Attribute", href: "/item-attribute" },
          ],
        },
        {
          title: "Serial No and Batch",
          links: [
            { label: "Serial No", href: "/serial-no" },
            { label: "Batch", href: "/batch" },
            { label: "Installation Note", href: "/installation-note" },
            {
              label: "Serial No Service Contract Expiry",
              href: "/service-contract-expiry",
            },
            { label: "Serial No Status", href: "/serial-status" },
            { label: "Serial No Warranty Expiry", href: "/warranty-expiry" },
          ],
        },
        {
          title: "Tools",
          links: [
            { label: "Packing Slip", href: "/packing-slip" },
            {
              label: "Quality Inspection Template",
              href: "/inspection-template",
            },
            { label: "Quick Stock Balance", href: "/quick-stock-balance" },
          ],
        },
        {
          title: "Key Reports",
          links: [
            { label: "Stock Analytics", href: "/stock-analytics" },
            { label: "Delivery Note Trends", href: "/delivery-trends" },
            { label: "Purchase Receipt Trends", href: "/receipt-trends" },
            { label: "Sales Order Analysis", href: "/sales-analysis" },
            { label: "Purchase Order Analysis", href: "/purchase-analysis" },
            { label: "Item Shortage Report", href: "/shortage-report" },
            { label: "Batch-Wise Balance History", href: "/batch-history" },
          ],
        },
        {
          title: "Other Reports",
          links: [
            {
              label: "Requested Items To Be Transferred",
              href: "/requested-transfer",
            },
            { label: "Batch Item Expiry Status", href: "/batch-expiry" },
            { label: "Item Prices", href: "/item-prices" },
            {
              label: "Itemwise Recommended Reorder Level",
              href: "/reorder-level",
            },
            { label: "Item Variant Details", href: "/variant-details" },
            { label: "Subcontracted Raw Materials", href: "/subcontract-raw" },
            {
              label: "Subcontracted Item To Be Received",
              href: "/subcontract-receive",
            },
          ],
        },
      ],
    },
  ];

  return <SectionGrid pageTitle="Stocks" groups={groups} />;
}
