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
    private ProductDao productdao;

    @GetMapping(path = "/number", produces = "application/json")
    public ResponseEntity<Integer>get() {
        int maxid = this.productdao.findMaxNumber();
        if (maxid == 0) maxid = 1;
        return ResponseEntity.ok().body(maxid);
    }

    @GetMapping(produces = "application/json")
    public List<Product> get(@RequestParam HashMap<String, String> params) {

        List<Product> productList = this.productdao.findAll();
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

//    @GetMapping(produces = "application/json")
//    public List<Product>get() {
//
//        List<Product> products = this.productdao.findAll();
//
//        products = products  .stream().map(product -> {
//                    Product p = new Product();
//                    p.setId(product.getId());
//                    p.setCode(product.getCode());
//                    p.setName(product.getName());
//                    p.setProductsize(product.getProductsize());
//                    p.setProductcategory(product.getProductcategory());
//                    p.setTcbeforecharge(product.getTcbeforecharge());
//                    p.setCharge(product.getCharge());
//                    p.setTotalcost(product.getTotalcost());
//                    p.setDesignimage(product.getDesignimage());
//                    p.setDesignimage(product.getDesignimage());
//                    p.setProductstatus(product.getProductstatus());
//                    p.setEmployee(product.getEmployee());
//                    return p;
//                }
//        ).collect(Collectors.toList());
////        materialcategories.forEach(materialcategory -> {
////            System.out.println(materialcategory.toString());
////
////        });
//        return products;
//    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(@RequestBody Product product) {

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        for (Productrawmaterial prm : product.getProductrawmaterials()) prm.setProduct(product);

        if (productdao.findByCode(product.getCode()) != null)
            errors = errors + "<br> Existing Product";

        if (errors == "") {
            productdao.save(product);
        } else {
            errors = "Server Validation Errors : <br> " + errors;
        }
        responce.put("id", String.valueOf(product.getId()));
        responce.put("url", "/products/" + product.getId());
        responce.put("errors", errors);

        return responce;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)

    public HashMap<String, String> update(@RequestBody Product product) {

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        Product p = productdao.findByMyId(product.getId());

        if (p != null && !(product.getCode().equals(p.getCode())))
            errors = errors + "<br> Not existing";


        if (p != null) {
            productdao.save(product);
        } else {
            errors = "Server Validation Errors : <br> " + errors;
        }
        responce.put("id", String.valueOf(product.getId()));
        responce.put("url", "/products/" + product.getId());
        responce.put("errors", errors);

        return responce;
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(@PathVariable Integer id) {

        // System.out.println(id);

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        Product p = productdao.findByMyId(id);

        if (p == null) errors = errors + "<br> Product Does Not Exist";

        if (errors.isEmpty()) productdao.delete(p);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(id));
        responce.put("url", "/products/" + id);
        responce.put("errors", errors);

        return responce;
    }

}