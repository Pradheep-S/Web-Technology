let rates={
    "s1":1599,
    "s2":1299,
    "s3":2999,
    "s4":999
};
let product=document.getElementById('product');
let cost=document.getElementById('cost');

function displaycost(){
    let selected=product.value;
    cost.textContent=rates[selected] ? "Rs." + rates[selected] + " /-": "Select a product to get cost";
}

product.addEventListener("change",displaycost);
displaycost();


let productNames = {
    "s1": "Bata Comfort Flex Sneakers",
    "s2": "Bata Urban Chic Loafers",
    "s3": "Bata Classic Leather",
    "s4": "Bata Active Sports"
};

document.getElementById('myForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    
    let name = document.getElementById('name').value;
    
    let address = document.getElementById('address').value;
    let selectedProduct = document.getElementById('product').value;
    let productName = productNames[selectedProduct];
    let productCost = rates[selectedProduct] ? rates[selectedProduct] : 0;
    let gst= productCost *0.12;
    let paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    let quantity=document.getElementById('quantity').value;

    
    let totalCost = (productCost + gst)*quantity;

    
    displayBill(name, address, productName, quantity, productCost, gst, totalCost, paymentMethod);
});

function displayBill(name, address, productName, quantity, productCost, gst, totalCost, paymentMethod) {
    let billSection = document.getElementById('billSection');
    billSection.innerHTML = `
        <h2>Order Summary</h2>
        <div>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Address:</strong> ${address}</p>
            <p><strong>Product:</strong> ${productName}</p>
            <p><strong>Quantity:</strong> ${quantity}</p>
            <p><strong>Product Cost:</strong> Rs. ${productCost}</p>
            <p><strong>GST:</strong> Rs. ${gst}</p>
            <p><strong>Total Cost:</strong> Rs. ${totalCost}</p>
            <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        </div>
    `;
}

/* Print button functionality
document.getElementById('printButton').addEventListener('click', function() {
    let name = document.getElementById('name').value;
    let address = document.getElementById('address').value;
    let selectedProduct = document.getElementById('product').value;
    let productName = productNames[selectedProduct];
    let productCost = rates[selectedProduct] ? rates[selectedProduct] : 0;
    let totalCost = productCost;

    let printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Order Summary</title></head><body>');
    printWindow.document.write('<h2>Order Summary</h2>');
    printWindow.document.write('<div>');
    printWindow.document.write('<p><strong>Name:</strong> ' + name + '</p>');
    printWindow.document.write('<p><strong>Address:</strong> ' + address + '</p>');
    printWindow.document.write('<p><strong>Product:</strong> ' + productName + '</p>');
    printWindow.document.write('<p><strong>Product Cost:</strong> Rs. ' + productCost + '</p>');
    printWindow.document.write('<p><strong>Total Cost:</strong> Rs. ' + totalCost + '</p>');
    printWindow.document.write('</div>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
});
*/  
