'use client';
import { useState, useRef } from 'react';
import { Order } from '@/data/orders';
import styles from './OrderReceiptModal.module.css';

interface OrderReceiptModalProps {
  order: Order | null;
  onClose: () => void;
}

export default function OrderReceiptModal({ order, onClose }: OrderReceiptModalProps) {
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const receiptPaperRef = useRef<HTMLDivElement>(null);

  if (!order) return null;

  const orderDate = new Date(order.createdAt).toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const cleanPhone = order.customer.phone.replace(/[^0-9]/g, '');
  const waCustomerLink = `https://wa.me/${
    cleanPhone.startsWith('234') ? cleanPhone : '234' + cleanPhone.replace(/^0/, '')
  }`;

  // 1. High-Res HTML5 Canvas Receipt Image Generator
  const generateReceiptCanvas = (): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context not available');

    // 1080px width (standard high-res mobile & WhatsApp resolution)
    const width = 1080;
    const baseHeight = 1100 + order.items.length * 85;
    const height = Math.max(1400, baseHeight);

    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Subtle header background
    ctx.fillStyle = '#F8F8FC';
    ctx.fillRect(0, 0, width, 240);

    // Border
    ctx.strokeStyle = '#E2E2EA';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    // Header: Brand name & Accent bar
    ctx.fillStyle = '#FF1E6A';
    ctx.fillRect(40, 40, 8, 80);

    ctx.fillStyle = '#0F0F14';
    ctx.font = 'bold 38px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('DOFIT WEARS', 65, 80);

    ctx.fillStyle = '#717182';
    ctx.font = '600 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('& ÀṢÀ CULTURAL COUTURE · LAGOS, NIGERIA', 65, 110);

    // Header Right: Receipt Tag & Reference
    ctx.fillStyle = '#0F0F14';
    ctx.fillRect(width - 320, 50, 260, 40);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('OFFICIAL RECEIPT', width - 190, 76);
    ctx.textAlign = 'left';

    ctx.fillStyle = '#FF1E6A';
    ctx.font = 'bold 30px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`#${order.id}`, width - 60, 130);

    ctx.fillStyle = '#717182';
    ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`Issued: ${orderDate}`, width - 60, 160);
    ctx.textAlign = 'left';

    // Divider
    ctx.strokeStyle = '#0F0F14';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(60, 240);
    ctx.lineTo(width - 60, 240);
    ctx.stroke();

    // Customer & Order Information Grid
    const infoY = 290;
    ctx.fillStyle = '#8E8E9F';
    ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('BILLED TO / CUSTOMER', 60, infoY);
    ctx.fillText('ORDER SUMMARY', width / 2 + 20, infoY);

    ctx.fillStyle = '#0F0F14';
    ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(order.customer.fullName, 60, infoY + 35);

    ctx.font = '18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#3F3F4E';
    ctx.fillText(`📞 ${order.customer.phone}`, 60, infoY + 68);
    ctx.fillText(`📍 ${order.customer.address}`, 60, infoY + 98);
    ctx.fillText(`   ${order.customer.city}, ${order.customer.state}`, 60, infoY + 124);

    // Right side meta
    ctx.fillStyle = '#0F0F14';
    ctx.font = '18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`Payment: ${order.paymentMethod || 'WhatsApp Transfer'}`, width / 2 + 20, infoY + 35);
    ctx.fillText(`Capsule: ${order.brand === 'asa' ? 'Àṣà Couture' : 'Dofit Wears'}`, width / 2 + 20, infoY + 68);

    ctx.fillStyle = order.status === 'Delivered' ? '#16A34A' : '#EAB308';
    ctx.fillText(`Status: ● ${order.status.toUpperCase()}`, width / 2 + 20, infoY + 98);

    // Items Table Header
    const tableY = 480;
    ctx.fillStyle = '#F2F2F7';
    ctx.fillRect(60, tableY, width - 120, 50);

    ctx.fillStyle = '#616173';
    ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('ITEM DESCRIPTION', 80, tableY + 32);
    ctx.fillText('SIZE', 560, tableY + 32);
    ctx.fillText('QTY', 680, tableY + 32);
    ctx.fillText('PRICE', 780, tableY + 32);
    ctx.textAlign = 'right';
    ctx.fillText('TOTAL (₦)', width - 80, tableY + 32);
    ctx.textAlign = 'left';

    // Item Rows
    let currentY = tableY + 50;
    order.items.forEach((item, index) => {
      ctx.fillStyle = index % 2 === 0 ? '#FFFFFF' : '#FAFAFD';
      ctx.fillRect(60, currentY, width - 120, 65);

      ctx.fillStyle = '#0F0F14';
      ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(item.name, 80, currentY + 38);

      ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#FF1E6A';
      ctx.fillText(item.size, 560, currentY + 38);

      ctx.fillStyle = '#2A2A38';
      ctx.font = '18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(`${item.quantity}`, 690, currentY + 38);
      ctx.fillText(`₦${item.unitPrice.toLocaleString()}`, 780, currentY + 38);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#0F0F14';
      ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(`₦${item.totalPrice.toLocaleString()}`, width - 80, currentY + 38);
      ctx.textAlign = 'left';

      // Row separator
      ctx.strokeStyle = '#EDEDF4';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(60, currentY + 65);
      ctx.lineTo(width - 120, currentY + 65);
      ctx.stroke();

      currentY += 65;
    });

    // Totals Box
    const totalsY = currentY + 30;
    const totalsLeft = width - 440;

    ctx.fillStyle = '#4E4E60';
    ctx.font = '18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Subtotal:', totalsLeft, totalsY);
    ctx.textAlign = 'right';
    ctx.fillText(`₦${order.subtotal.toLocaleString()}`, width - 80, totalsY);
    ctx.textAlign = 'left';

    if (order.discount > 0) {
      ctx.fillStyle = '#16A34A';
      ctx.fillText('Promo Discount:', totalsLeft, totalsY + 35);
      ctx.textAlign = 'right';
      ctx.fillText(`-₦${order.discount.toLocaleString()}`, width - 80, totalsY + 35);
      ctx.textAlign = 'left';
    }

    ctx.fillStyle = '#4E4E60';
    ctx.fillText('Delivery Fee:', totalsLeft, totalsY + (order.discount > 0 ? 70 : 35));
    ctx.textAlign = 'right';
    ctx.fillText('Quoted on Inquiry', width - 80, totalsY + (order.discount > 0 ? 70 : 35));
    ctx.textAlign = 'left';

    // Total Amount line
    const finalTotalY = totalsY + (order.discount > 0 ? 120 : 85);
    ctx.strokeStyle = '#0F0F14';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(totalsLeft, finalTotalY - 20);
    ctx.lineTo(width - 80, finalTotalY - 20);
    ctx.stroke();

    ctx.fillStyle = '#0F0F14';
    ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('TOTAL DUE:', totalsLeft, finalTotalY + 15);

    ctx.fillStyle = '#FF1E6A';
    ctx.font = 'bold 34px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`₦${order.totalAmount.toLocaleString()}`, width - 80, finalTotalY + 18);
    ctx.textAlign = 'left';

    // Official Stamp / Seal (Bottom Left)
    const sealY = finalTotalY + 70;
    ctx.strokeStyle = '#16A34A';
    ctx.lineWidth = 3;
    ctx.strokeRect(60, sealY, 320, 80);

    ctx.fillStyle = '#16A34A';
    ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('✓ DOFIT OFFICIAL RECEIPT', 80, sealY + 34);
    ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('VERIFIED AUTHENTIC SALES RECORD', 80, sealY + 58);

    // Footer
    const footerY = height - 90;
    ctx.strokeStyle = '#E2E2EA';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(60, footerY - 25);
    ctx.lineTo(width - 60, footerY - 25);
    ctx.stroke();

    ctx.fillStyle = '#8E8E9F';
    ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Thank you for shopping with Dofit Wears & Àṣà Cultural Couture.', 60, footerY);
    ctx.fillText('WhatsApp Concierge: +234 901 694 6854  ·  Online Store: https://dofit.fit', 60, footerY + 24);

    return canvas;
  };

  // Download High-Res PNG Image
  const handleDownloadImage = () => {
    setGenerating(true);
    try {
      const canvas = generateReceiptCanvas();
      const link = document.createElement('a');
      link.download = `dofit-receipt-${order.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Receipt generation error:', err);
      alert('Could not generate receipt image.');
    } finally {
      setGenerating(false);
    }
  };

  // Direct WhatsApp Share (Uses Web Share API on mobile, or clipboard on desktop)
  const handleShareWhatsApp = async () => {
    setGenerating(true);
    try {
      const canvas = generateReceiptCanvas();

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const file = new File([blob], `dofit-receipt-${order.id}.png`, { type: 'image/png' });

        // If Web Share API is available with file support (Mobile Chrome / Safari)
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: `Dofit Receipt #${order.id}`,
              text: `Here is your official receipt for Order #${order.id} from Dofit Wears:`,
              files: [file],
            });
            return;
          } catch (shareErr) {
            // User cancelled share
          }
        }

        // Desktop Fallback: Trigger image download and open customer WhatsApp chat
        const link = document.createElement('a');
        link.download = `dofit-receipt-${order.id}.png`;
        link.href = URL.createObjectURL(blob);
        link.click();

        const message = `Hello ${order.customer.fullName}, thank you for your order with Dofit Wears! Here is your official order receipt:\n\n*Receipt Ref:* #${order.id}\n*Total:* ₦${order.totalAmount.toLocaleString()}\n*Items:* ${order.items.map((i) => `${i.quantity}x ${i.name} (${i.size})`).join(', ')}\n*Delivery Address:* ${order.customer.address}, ${order.customer.city}\n\nYour package is being prepared for dispatch!`;

        const waUrl = `${waCustomerLink}?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');
      }, 'image/png');
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  // Print / Save as PDF
  const handlePrintPdf = () => {
    const printContent = receiptPaperRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to print or save the PDF receipt.');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Dofit Receipt #${order.id}</title>
          <style>
            @page { size: A4; margin: 20mm; }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #fff; color: #111; margin: 0; padding: 20px; }
            .receipt { max-width: 650px; margin: 0 auto; border: 1px solid #ddd; padding: 30px; border-radius: 8px; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #111; padding-bottom: 16px; margin-bottom: 20px; }
            .brand { font-size: 24px; font-weight: 900; color: #111; }
            .ref { font-family: monospace; font-size: 18px; font-weight: bold; color: #FF1E6A; text-align: right; }
            .details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; font-size: 13px; line-height: 1.4; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
            th { text-align: left; background: #f4f4f7; padding: 10px 8px; border-bottom: 2px solid #111; font-size: 11px; text-transform: uppercase; }
            td { padding: 10px 8px; border-bottom: 1px solid #eee; }
            .summary { display: flex; justify-content: flex-end; font-size: 13px; margin-bottom: 20px; }
            .total { font-size: 18px; font-weight: bold; color: #FF1E6A; border-top: 2px solid #111; padding-top: 8px; margin-top: 8px; }
            .footer { border-top: 1px dashed #ccc; padding-top: 16px; font-size: 11px; color: #666; display: flex; justify-content: space-between; align-items: center; }
            .stamp { border: 2px solid #22c55e; color: #16a34a; font-weight: 800; padding: 6px 12px; border-radius: 4px; font-size: 11px; text-transform: uppercase; }
          </style>
        </head>
        <body>
          <div class="receipt">
            ${printContent.innerHTML}
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleCopyText = () => {
    const text = `🧾 *DOFIT WEARS · OFFICIAL ORDER RECEIPT*\n*Receipt Ref:* #${order.id}\n*Date:* ${orderDate}\n*Customer:* ${order.customer.fullName}\n*Phone:* ${order.customer.phone}\n*Delivery Address:* ${order.customer.address}, ${order.customer.city}, ${order.customer.state}\n\n*ITEMS ORDERED:*\n${order.items.map((i) => `• ${i.quantity}x ${i.name} (${i.size}) - ₦${i.totalPrice.toLocaleString()}`).join('\n')}\n\n*Subtotal:* ₦${order.subtotal.toLocaleString()}\n*Delivery Fee:* Quoted on Inquiry\n*TOTAL PAID:* ₦${order.totalAmount.toLocaleString()}\n*Status:* ${order.status}\n\n_Thank you for choosing Dofit Wears & Àṣà._\n_WhatsApp Concierge: +234 901 694 6854_`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            <span>🧾</span>
            <span>Official Order Receipt · #{order.id}</span>
          </h3>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Modal Body: High-End Printable/Viewable Receipt */}
        <div className={styles.modalBody}>
          <div className={styles.receiptPaper} ref={receiptPaperRef}>
            {/* Top Bar */}
            <div className={styles.receiptTop}>
              <div className={styles.brandBlock}>
                <h1 className={styles.brandName}>DOFIT WEARS</h1>
                <span className={styles.brandSub}>&amp; Àṣà Cultural Couture · Lagos</span>
              </div>
              <div className={styles.receiptMeta}>
                <span className={styles.receiptBadge}>Official Receipt</span>
                <span className={styles.receiptRef}>#{order.id}</span>
                <span className={styles.receiptDate}>{orderDate}</span>
              </div>
            </div>

            {/* Customer Details Grid */}
            <div className={styles.detailsGrid}>
              <div className={styles.detailCol}>
                <span className={styles.detailLabel}>Billed To / Customer</span>
                <span className={styles.detailValue}>{order.customer.fullName}</span>
                <span className={styles.detailSub}>{order.customer.phone}</span>
                <span className={styles.detailSub}>
                  {order.customer.address}, {order.customer.city}, {order.customer.state}
                </span>
              </div>
              <div className={styles.detailCol}>
                <span className={styles.detailLabel}>Order Logistics</span>
                <span className={styles.detailSub}>
                  Payment: <strong>{order.paymentMethod || 'WhatsApp Transfer'}</strong>
                </span>
                <span className={styles.detailSub}>
                  Brand: <strong>{order.brand === 'asa' ? 'Àṣà Couture' : 'Dofit Wears'}</strong>
                </span>
                <span className={styles.detailSub}>
                  Status:{' '}
                  <strong style={{ color: order.status === 'Delivered' ? '#16A34A' : '#EAB308' }}>
                    ● {order.status}
                  </strong>
                </span>
              </div>
            </div>

            {/* Itemized Table */}
            <table className={styles.itemsTable}>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Size</th>
                  <th style={{ textAlign: 'center' }}>Qty</th>
                  <th style={{ textAlign: 'right' }}>Unit (₦)</th>
                  <th style={{ textAlign: 'right' }}>Total (₦)</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((it, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className={styles.itemName}>{it.name}</div>
                      <div className={styles.itemMeta}>
                        {it.brand === 'asa' ? 'Àṣà Cultural' : 'Dofit Activewear'}
                      </div>
                    </td>
                    <td>
                      <strong style={{ color: '#FF1E6A' }}>{it.size}</strong>
                    </td>
                    <td style={{ textAlign: 'center' }}>{it.quantity}</td>
                    <td style={{ textAlign: 'right' }}>₦{it.unitPrice.toLocaleString()}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>
                      ₦{it.totalPrice.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary */}
            <div className={styles.summaryRow}>
              <div className={styles.summaryTable}>
                <div className={styles.summaryLine}>
                  <span>Subtotal:</span>
                  <span>₦{order.subtotal.toLocaleString()}</span>
                </div>
                {order.discount > 0 && (
                  <div className={styles.summaryLine} style={{ color: '#16A34A' }}>
                    <span>Promo Discount:</span>
                    <span>-₦{order.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className={styles.summaryLine}>
                  <span>Delivery Fee:</span>
                  <span>Quoted on Inquiry</span>
                </div>
                <div className={styles.summaryTotal}>
                  <span>Total Amount:</span>
                  <span className={styles.totalHighlight}>
                    ₦{order.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Receipt Footer */}
            <div className={styles.receiptFooter}>
              <div className={styles.footerNotes}>
                <div>Thank you for choosing Dofit Wears &amp; Àṣà.</div>
                <div>WhatsApp Concierge: +234 901 694 6854 · dofit.fit</div>
              </div>
              <div className={styles.stampSeal}>✓ Verified Order</div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className={styles.modalFooter}>
          <button
            type="button"
            className={styles.pdfBtn}
            onClick={handleCopyText}
            title="Copy WhatsApp text summary"
          >
            <span>📋</span>
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
          </button>

          <div className={styles.actionBtnGroup}>
            <button
              type="button"
              className={styles.pdfBtn}
              onClick={handlePrintPdf}
              title="Print or Save as PDF"
            >
              <span>📄</span>
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              className={styles.downloadBtn}
              onClick={handleDownloadImage}
              disabled={generating}
              title="Generate and download High-Res Image Receipt"
            >
              <span>🖼️</span>
              <span>{generating ? 'Rendering...' : 'Download Image'}</span>
            </button>

            <button
              type="button"
              className={styles.waBtn}
              onClick={handleShareWhatsApp}
              disabled={generating}
              title="Send directly to customer on WhatsApp"
            >
              <span>💬</span>
              <span>Send via WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
