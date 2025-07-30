import { prisma } from '@/lib/prismaService';
import { generateOrderPDF, OrderPDFData, cleanupPDF } from './pdf';
import { sendOrderConfirmationEmail } from './email';
import { getEmailConfig } from './emailConfig';

/**
 * Send order receipt email to customer
 * @param orderId The ID of the order to send receipt for
 * @param locale The locale for email content (defaults to 'en')
 * @returns Promise<boolean> True if email sent successfully
 */
export async function sendOrderReceipt(
  orderId: string,
  locale: string = 'en'
): Promise<boolean> {
  try {
    console.log(
      `Starting sendOrderReceipt for order: ${orderId}, locale: ${locale}`
    );

    // Step 1: Get order from database
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: true,
        user: true,
      },
    });

    if (!order) {
      console.error(`Order not found: ${orderId}`);
      return false;
    }

    console.log(`Order found: ${order.id}`);

    // Step 2: Validate order has required email
    if (!order.shippingEmail) {
      console.error(`Order ${orderId} has no shipping email`);
      return false;
    }

    // Step 3: Calculate order totals
    const subtotalWithoutTax = order.orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shippingCost = order.shippingCost || 0;
    const discount = order.discount || 0;
    const taxAmount = order.taxAmount || 0;

    // Step 4: Prepare order data for PDF and email
    const orderData: OrderPDFData = {
      id: order.id,
      createdAt: order.createdAt,
      shippingName: order.shippingName || 'Customer',
      shippingEmail: order.shippingEmail,
      shippingPhone: order.shippingPhone || '',
      shippingAddress: order.shippingAddress || '',
      paymentMethod: order.paymentMethod || 'Card',
      shippingMethod: order.shippingMethod || 'Standard',
      items: order.orderItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        productType: item.productType,
      })),
      subtotal: subtotalWithoutTax,
      shippingCost,
      discount,
      taxAmount,
      totalAmount: order.totalAmount,
    };

    console.log('Order data prepared successfully');

    // Step 5: Generate PDF receipt
    const pdfPath = await generateOrderPDF({
      orderId: order.id,
      orderNumber: order.id,
      customerName: orderData.shippingName,
      customerEmail: orderData.shippingEmail,
      orderDate: order.createdAt.toLocaleDateString(),
      totalAmount: order.totalAmount,
      items: orderData.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      })),
      billingAddress: orderData.shippingAddress
        ? {
            street: orderData.shippingAddress,
            city: 'N/A',
            postalCode: 'N/A',
            country: 'Latvia',
          }
        : undefined,
      shippingAddress: orderData.shippingAddress
        ? {
            street: orderData.shippingAddress,
            city: 'N/A',
            postalCode: 'N/A',
            country: 'Latvia',
          }
        : undefined,
    });

    console.log(`PDF generated: ${pdfPath}`);

    // Step 6: Get email configuration
    const emailConfig = await getEmailConfig();
    console.log('Email config retrieved successfully');

    // Step 7: Determine customer name
    const customerName =
      order.shippingName ||
      (order.user
        ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim()
        : 'Customer') ||
      'Customer';

    // Step 8: Send order confirmation email
    await sendOrderConfirmationEmail(
      order.shippingEmail,
      orderData,
      pdfPath,
      emailConfig,
      locale,
      customerName
    );

    console.log('Email sent successfully');

    // Step 9: Cleanup PDF file
    await cleanupPDF(pdfPath);
    console.log('PDF cleaned up');

    // Step 10: Log the email send activity (optional audit trail)
    try {
      await prisma.emailLog.create({
        data: {
          orderId: order.id,
          recipientEmail: order.shippingEmail,
          emailType: 'ORDER_RECEIPT',
          status: 'SENT',
          sentAt: new Date(),
        },
      });
    } catch (auditError) {
      // Don't fail the main operation if audit logging fails
      console.warn('Failed to log email send activity:', auditError);
    }

    return true;
  } catch (error) {
    console.error('Error in sendOrderReceipt:', error);
    return false;
  }
}

/**
 * Send order approval email to customer
 * @param orderId The ID of the order to send approval for
 * @param locale The locale for email content (defaults to 'en')
 * @returns Promise<boolean> True if email sent successfully
 */
export async function sendOrderApproval(
  orderId: string,
  locale: string = 'en'
): Promise<boolean> {
  try {
    console.log(
      `Starting sendOrderApproval for order: ${orderId}, locale: ${locale}`
    );

    // Get order from database
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: true,
        user: true,
      },
    });

    if (!order) {
      console.error(`Order not found: ${orderId}`);
      return false;
    }

    if (!order.shippingEmail) {
      console.error(`Order ${orderId} has no shipping email`);
      return false;
    }

    // Prepare order data
    const subtotalWithoutTax = order.orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shippingCost = order.shippingCost || 0;
    const discount = order.discount || 0;
    const taxAmount = order.taxAmount || 0;

    const orderData: OrderPDFData = {
      id: order.id,
      createdAt: order.createdAt,
      shippingName: order.shippingName || 'Customer',
      shippingEmail: order.shippingEmail,
      shippingPhone: order.shippingPhone || '',
      shippingAddress: order.shippingAddress || '',
      paymentMethod: order.paymentMethod || 'Card',
      shippingMethod: order.shippingMethod || 'Standard',
      items: order.orderItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        productType: item.productType,
      })),
      subtotal: subtotalWithoutTax,
      shippingCost,
      discount,
      taxAmount,
      totalAmount: order.totalAmount,
    };

    // Get email configuration
    const emailConfig = await getEmailConfig();

    // Determine customer name
    const customerName =
      order.shippingName ||
      (order.user
        ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim()
        : 'Customer') ||
      'Customer';

    // Send order approval email (import dynamically to avoid circular dependencies)
    const { sendOrderApprovalEmail } = await import('./email');
    await sendOrderApprovalEmail(
      order.shippingEmail,
      orderData,
      emailConfig,
      locale,
      customerName
    );

    console.log('Order approval email sent successfully');

    // Log the email send activity
    try {
      await prisma.emailLog.create({
        data: {
          orderId: order.id,
          recipientEmail: order.shippingEmail,
          emailType: 'ORDER_APPROVAL',
          status: 'SENT',
          sentAt: new Date(),
        },
      });
    } catch (auditError) {
      console.warn('Failed to log email send activity:', auditError);
    }

    return true;
  } catch (error) {
    console.error('Error in sendOrderApproval:', error);
    return false;
  }
}
