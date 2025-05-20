import json

with open('product_data.json', 'r') as file:
    data = json.load(file)

n = len(data)


allProducts = []

for product in data:
    productDataset = {}
    productDataset["productID"] = product["productID"]
    productDataset["ProductName"] = product["brand"]
    productDataset["ProductDescription"] = {
        "brand" : product["brand"].split(' ')[0],
        "size"  : "X,XL,L,M",
        "color" : product["color"],
        "shortDescription" : f"{product['mcat']} {product['scat']} {product['name']} {product['color']}"
    }
    productDataset["gender"] = product["gender"]
    productDataset["season"] = product["season"]
    productDataset["usage"] = product["usage"]
    productDataset["productCost"] = product["price"]
    productDataset["Ratings"] = {
        "avgRating" : product["avg rating"],
        "totalRatings" : product["no of ratings"]
    }
    productDataset["image"] = product['url'] # type: ignore
    allProducts.append(productDataset)


with open('product_dataset.json', 'w') as file:
    json.dump(allProducts, file, indent=4)

print(n)
