import fs from 'fs';
import path from 'path';

export interface OrderPDFData {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  totalAmount: number;
  items: {
    name: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  billingAddress?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  shippingAddress?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

/**
 * Generates a PDF receipt for an order
 * @param orderData The order data to include in the PDF
 * @returns Promise<string> Path to the generated PDF file
 */
export async function generateOrderPDF(
  orderData: OrderPDFData
): Promise<string> {
  try {
    // Create a temporary directory for PDFs if it doesn't exist
    const tempDir = path.join(process.cwd(), 'temp', 'pdfs');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Generate PDF filename
    const fileName = `order-${orderData.orderId}-${Date.now()}.pdf`;
    const filePath = path.join(tempDir, fileName);

    // For now, create a simple text-based receipt
    // In a real implementation, you would use a PDF library like jsPDF or PDFKit
    const receiptContent = generateReceiptText(orderData);

    // Write the content to a text file (simulate PDF generation)
    // In production, this would generate an actual PDF
    fs.writeFileSync(filePath.replace('.pdf', '.txt'), receiptContent);

    // Return the file path (in production this would be the actual PDF path)
    return filePath.replace('.pdf', '.txt');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate order PDF');
  }
}

/**
 * Cleans up a generated PDF file
 * @param filePath Path to the PDF file to delete
 */
export async function cleanupPDF(filePath: string): Promise<void> {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`PDF cleaned up: ${filePath}`);
    }
  } catch (error) {
    console.error('Error cleaning up PDF:', error);
    // Don't throw error for cleanup failures
  }
}

/**
 * Generates the text content for the receipt
 */
function generateReceiptText(orderData: OrderPDFData): string {
  const {
    orderNumber,
    customerName,
    customerEmail,
    orderDate,
    totalAmount,
    items,
    billingAddress,
    shippingAddress,
  } = orderData;

  let content = `
===============================================
                ORDER RECEIPT
===============================================

Order Number: ${orderNumber}
Order Date: ${orderDate}
Customer: ${customerName}
Email: ${customerEmail}

-----------------------------------------------
                ORDER ITEMS
-----------------------------------------------
`;

  items.forEach((item, index) => {
    content += `
${index + 1}. ${item.name}
   Quantity: ${item.quantity}
   Price: $${item.price.toFixed(2)}
   Total: $${item.total.toFixed(2)}
`;
  });

  content += `
-----------------------------------------------
                 TOTAL AMOUNT
-----------------------------------------------
Total: $${totalAmount.toFixed(2)}
`;

  if (billingAddress) {
    content += `
-----------------------------------------------
              BILLING ADDRESS
-----------------------------------------------
${billingAddress.street}
${billingAddress.city}, ${billingAddress.postalCode}
${billingAddress.country}
`;
  }

  if (shippingAddress) {
    content += `
-----------------------------------------------
             SHIPPING ADDRESS
-----------------------------------------------
${shippingAddress.street}
${shippingAddress.city}, ${shippingAddress.postalCode}
${shippingAddress.country}
`;
  }

  content += `
-----------------------------------------------
Thank you for your order!
-----------------------------------------------
`;

  return content;
}
