<?php
header('Content-Type: application/json');

// Method to Fetch Products
function fetchProducts($searchQuery, $limit, $offset) {
    $apiUrl   = "https://global1.atdtravel.com/api/products?limit=" . $limit . "&offset=" . $offset . "&geo=en&title=" . urlencode($searchQuery);
    $ch       = curl_init($apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Ensure response is returned
    $response = curl_exec($ch);
    curl_close($ch);
    $jsonData = json_decode($response, true);

    return $jsonData;
}

if (isset($_GET['product_name'])) {
    $searchQuery = trim($_GET['product_name']);
    $limit       = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;  
    $offset      = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;

    if (!empty($searchQuery)) {
        $searchQuery = htmlspecialchars($searchQuery);
        $result      = fetchProducts($searchQuery, $limit, $offset);      
        echo json_encode($result);
    }
}
?>