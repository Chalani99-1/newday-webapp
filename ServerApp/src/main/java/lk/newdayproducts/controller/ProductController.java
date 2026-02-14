package lk.newdayproducts.controller;


import lk.newdayproducts.dao.ProductDao;
import lk.newdayproducts.entity.Product;
import lk.newdayproducts.entity.Productrawmaterial;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/products")
public class ProductController {

    @Autowired
    private ProductDao productDao;


    @GetMapping(path = "/number", produces = "application/json")
    public ResponseEntity<Integer> get() {
        int maxid = this.productDao.findMaxNumber();
        if (maxid == 0) maxid = 1;
        return ResponseEntity.ok().body(maxid);
    }

    @GetMapping(produces = "application/json")
    public List<Product> get(@RequestParam HashMap<String, String> params) {

        List<Product> productList = this.productDao.findAll();
        if (params.isEmpty()) return productList;
        String code = params.get("code");
        String productcategoryid = params.get("productcategoryid");
        String productsizeid = params.get("productsizeid");


        Stream<Product> stream = productList.stream();
        if (code != null)
            stream = stream.filter(pc -> pc.getCode().equals(code));
        if (productcategoryid != null)
            stream = stream.filter(pc -> pc.getProductcategory().getId() == Integer.parseInt(productcategoryid));
        if (productsizeid != null)
            stream = stream.filter(pc -> pc.getProductsize().getId() == Integer.parseInt(productsizeid));

        return stream.collect(Collectors.toList());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(@RequestBody Product product) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        for (Productrawmaterial prm : product.getProductrawmaterials()) prm.setProduct(product);

        if (productDao.findByCode(product.getCode()) != null)
            errors = errors + "<br> Existing Product";

        if (errors == "") {
            productDao.save(product);
        } else {
            errors = "Server Validation Errors : <br> " + errors;
        }

        response.put("id", String.valueOf(product.getId()));
        response.put("url", "/products/" + product.getId());
        response.put("errors", errors);

        return response;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> update(@RequestBody Product product) {

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Product extProduct = productDao.findByMyId(product.getId());
        if (product.getProductrawmaterials() != null) {
            for (Productrawmaterial prm : product.getProductrawmaterials()) {
                prm.setProduct(product);
            }
        }

        if (extProduct != null && !(product.getCode().equals(extProduct.getCode())))
            errors = errors + "<br> Not existing";


        if (extProduct != null) {
            productDao.save(product);
        } else {
            errors = "Server Validation Errors : <br> " + errors;
        }


        response.put("id", String.valueOf(product.getId()));
        response.put("url", "/products/" + product.getId());
        response.put("errors", errors);

        return response;
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(@PathVariable Integer id) {

        boolean usedInOldOrders = false;
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Product extProduct = productDao.findByMyId(id);

        if (extProduct == null) errors = errors + "<br> Product Does Not Exist";

        if (errors == "") {
            productDao.delete(extProduct);
        } else {
            errors = "Server Validation Errors : <br> " + errors;
        }
        response.put("id", String.valueOf(id));
        response.put("url", "/products/" + id);
        response.put("errors", errors);

        return response;
    }

}




