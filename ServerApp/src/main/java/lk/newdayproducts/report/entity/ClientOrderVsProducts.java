package lk.newdayproducts.report.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class ClientOrderVsProducts {

    @Id
    private Integer id;
    private String number;
    private String productName;
    private String productCode;
    private Integer amount;
    private Integer completed;
    private double percentage;

    public ClientOrderVsProducts() {
    }

    public ClientOrderVsProducts(String number, String productName, String productCode, Integer amount, Integer completed) {
        this.number = number;
        this.productName = productName;
        this.productCode = productCode;
        this.amount = amount;
        this.completed = completed;
    }

    public ClientOrderVsProducts(String number, String productName, Integer amount, Integer completed) {
        this.number = number;
        this.productName = productName;
        this.amount = amount;
        this.completed = completed;
    }

    public String getProductCode() {
        return productCode;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode;
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

    public Integer getAmount() {
        return amount;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }

    public double getPercentage() {
        return percentage;
    }
    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }
}
