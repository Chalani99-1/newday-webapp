package lk.newdayproducts.report.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class ClientOrderVsProducts {

    @Id
    private Integer id;
    private String number;
    private String productCode;
    private String productName;
    private Integer amount;
    private Integer completed;

    public ClientOrderVsProducts() {
    }

    public ClientOrderVsProducts(String number, String productCode, String productName, Integer amount, Integer completed) {
        this.number = number;
        this.productCode = productCode;
        this.productName = productName;
        this.amount = amount;
        this.completed = completed;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Integer getCompleted() {
        return completed;
    }

    public void setCompleted(Integer completed) {
        this.completed = completed;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getProductCode() {
        return productCode;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode;
    }

    public Integer getAmount() {
        return amount;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }
}
