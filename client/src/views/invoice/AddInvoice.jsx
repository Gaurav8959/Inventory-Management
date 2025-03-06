import React, { useState } from 'react';
import { Form, Button, Row, Col, Card, Table } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { FaPlus, FaTrash, FaFilePdf } from 'react-icons/fa';
import './InvoiceGenerator.css';

const InvoiceGenerator = () => {
  const [invoice, setInvoice] = useState({
    sellerName: '',
    sellerEmail: '',
    sellerAddress: '',
    invoiceNumber: '',
    invoiceDate: '',
    dueDate: '',
    customerName: '',
    customerEmail: '',
    customerMobile: '',
    customerAddress: '',
    items: [],
    discountPercentage: 0,
    taxPercentage: 0,
    notes: '',
  });

  const [newItem, setNewItem] = useState({ description: '', quantity: 1, price: 0 });

  const validateForm = () => {
    const requiredFields = [
      'sellerName', 'sellerEmail', 'sellerAddress',
      'invoiceNumber', 'invoiceDate', 'dueDate',
      'customerName', 'customerEmail', 'customerAddress'
    ];

    for (const field of requiredFields) {
      if (!invoice[field]) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    if (invoice.items.length === 0) {
      toast.error('Please add at least one item');
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    setInvoice({ ...invoice, [e.target.name]: e.target.value });
  };

  const handleItemChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const addItem = () => {
    if (!newItem.description.trim() || newItem.quantity <= 0 || newItem.price <= 0) {
      toast.error('Please fill all item fields correctly');
      return;
    }
    setInvoice({ ...invoice, items: [...invoice.items, newItem] });
    setNewItem({ description: '', quantity: 1, price: 0 });
  };

  const removeItem = (index) => {
    setInvoice({ ...invoice, items: invoice.items.filter((_, i) => i !== index) });
  };

  const calculations = {
    subtotal: () => invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0),
    discount: () => calculations.subtotal() * (invoice.discountPercentage / 100),
    tax: () => (calculations.subtotal() - calculations.discount()) * (invoice.taxPercentage / 100),
    total: () => calculations.subtotal() - calculations.discount() + calculations.tax(),
  };

  const generatePDF = () => {
    if (!validateForm()) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setFontSize(22);
    doc.setTextColor(255);
    doc.text('INVOICE', 20, 25);

    // Metadata
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.text(`Invoice Number: ${invoice.invoiceNumber}`, pageWidth - 60, 20);
    doc.text(`Date: ${invoice.invoiceDate}`, pageWidth - 60, 27);
    doc.text(`Due Date: ${invoice.dueDate}`, pageWidth - 60, 34);

    // Bill From/To
    doc.setFontSize(11);
    doc.text(`BILL FROM:`, 20, 50);
    doc.text(invoice.sellerName, 20, 57);
    doc.text(invoice.sellerEmail, 20, 64);
    doc.text(invoice.sellerAddress, 20, 71);

    doc.text(`BILL TO:`, 20, 85);
    doc.text(invoice.customerName, 20, 92);
    doc.text(invoice.customerEmail, 20, 99);
    doc.text(invoice.customerAddress, 20, 106);

    // Items Table
    doc.autoTable({
      startY: 115,
      head: [['Description', 'Qty', 'Unit Price', 'Total']],
      body: invoice.items.map(item => [
        item.description,
        item.quantity,
        `$${item.price.toFixed(2)}`,
        `$${(item.quantity * item.price).toFixed(2)}`
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      margin: { horizontal: 15 },
    });

    // Totals
    const finalY = doc.autoTable.previous.finalY + 10;
    doc.setFontSize(12);
    doc.text(`Subtotal: $${calculations.subtotal().toFixed(2)}`, pageWidth - 60, finalY);
    doc.text(`Discount: $${calculations.discount().toFixed(2)}`, pageWidth - 60, finalY + 8);
    doc.text(`Tax: $${calculations.tax().toFixed(2)}`, pageWidth - 60, finalY + 16);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: $${calculations.total().toFixed(2)}`, pageWidth - 60, finalY + 24);

    // Notes
    doc.setFont('helvetica', 'normal');
    doc.text(`Notes: ${invoice.notes}`, 20, finalY + 35);

    doc.save(`invoice_${invoice.invoiceNumber}.pdf`);
    toast.success('Invoice generated successfully!');
  };

  const renderFormSection = (title, fields) => (
    <Card className="mb-4">
      <Card.Header className="bg-light">
        <h5 className="mb-0">{title}</h5>
      </Card.Header>
      <Card.Body>
        <Row>
          {fields.map((field, index) => (
            <Col key={index} md={field.col || 12} className="mb-3">
              <Form.Label>{field.label}</Form.Label>
              <Form.Control
                type={field.type || 'text'}
                name={field.name}
                value={invoice[field.name]}
                onChange={handleChange}
                required={field.required}
                placeholder={field.placeholder}
                min={field.min}
                step={field.step}
              />
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );

  const formSections = [
    {
      title: 'Bill From',
      fields: [
        { label: 'Company Name', name: 'sellerName', col: 6, required: true },
        { label: 'Email', name: 'sellerEmail', type: 'email', col: 6, required: true },
        { label: 'Address', name: 'sellerAddress', required: true },
      ],
    },
    {
      title: 'Invoice Details',
      fields: [
        { label: 'Invoice Number', name: 'invoiceNumber', col: 4, required: true },
        { label: 'Invoice Date', name: 'invoiceDate', type: 'date', col: 4, required: true },
        { label: 'Due Date', name: 'dueDate', type: 'date', col: 4, required: true },
      ],
    },
    {
      title: 'Bill To',
      fields: [
        { label: 'Client Name', name: 'customerName', col: 6, required: true },
        { label: 'Email', name: 'customerEmail', type: 'email', col: 6, required: true },
        { label: 'Mobile', name: 'customerMobile', type: 'tel', col: 6 },
        { label: 'Address', name: 'customerAddress', col: 6, required: true },
      ],
    },
  ];

  return (
    <Card className="shadow-lg">
      <Card.Header className="bg-primary text-white">
        <Card.Title as="h3" className="mb-0">
          <FaFilePdf className="me-2" />
          Invoice Generator
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <Form>
          {formSections.map((section, index) => renderFormSection(section.title, section.fields))}

          {/* Items Section */}
          <Card className="mb-4">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Items</h5>
            </Card.Header>
            <Card.Body>
              <Row className="g-2 mb-3">
                <Col md={6}>
                  <Form.Control
                    name="description"
                    value={newItem.description}
                    onChange={handleItemChange}
                    placeholder="Item description"
                  />
                </Col>
                <Col md={2}>
                  <Form.Control
                    type="number"
                    name="quantity"
                    min="1"
                    value={newItem.quantity}
                    onChange={handleItemChange}
                  />
                </Col>
                <Col md={2}>
                  <Form.Control
                    type="number"
                    name="price"
                    min="0"
                    step="0.01"
                    value={newItem.price}
                    onChange={handleItemChange}
                    placeholder="Price"
                  />
                </Col>
                <Col md={2}>
                  <Button variant="success" onClick={addItem} className="w-100">
                    <FaPlus className="me-2" />
                    Add Item
                  </Button>
                </Col>
              </Row>

              {invoice.items.length > 0 && (
                <Table striped hover className="mt-3">
                  <thead className="bg-primary text-white">
                    <tr>
                      <th>Description</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th>Total</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.description}</td>
                        <td>{item.quantity}</td>
                        <td>${item.price.toFixed(2)}</td>
                        <td>${(item.quantity * item.price).toFixed(2)}</td>
                        <td>
                          <Button variant="outline-danger" size="sm" onClick={() => removeItem(index)}>
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>

          {/* Calculations and Notes */}
          <Card className="mb-4">
            <Card.Body>
              <Row className="mb-4">
                <Col md={6}>
                  <Form.Label>Discount Percentage</Form.Label>
                  <Form.Control
                    type="number"
                    name="discountPercentage"
                    value={invoice.discountPercentage}
                    onChange={handleChange}
                    min="0"
                    max="100"
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>Tax Percentage</Form.Label>
                  <Form.Control
                    type="number"
                    name="taxPercentage"
                    value={invoice.taxPercentage}
                    onChange={handleChange}
                    min="0"
                    max="100"
                  />
                </Col>
              </Row>

              <div className="text-end mb-4">
                <h5>Subtotal: ${calculations.subtotal().toFixed(2)}</h5>
                <h5 className="text-danger">Discount: ${calculations.discount().toFixed(2)}</h5>
                <h5 className="text-danger">Tax: ${calculations.tax().toFixed(2)}</h5>
                <h3 className="mt-3 text-primary">
                  Total: ${calculations.total().toFixed(2)}
                </h3>
              </div>

              <Form.Group>
                <Form.Label>Additional Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="notes"
                  value={invoice.notes}
                  onChange={handleChange}
                  placeholder="Additional notes or special instructions"
                />
              </Form.Group>
            </Card.Body>
          </Card>

          <div className="d-grid">
            <Button variant="primary" size="lg" onClick={generatePDF} disabled={invoice.items.length === 0}>
              <FaFilePdf className="me-2" />
              Generate Invoice
            </Button>
          </div>
        </Form>
        <ToastContainer position="bottom-right" />
      </Card.Body>
    </Card>
  );
};

export default InvoiceGenerator;