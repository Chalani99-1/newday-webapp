package lk.newdayproducts.report.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class ProductionVsAmount {

    @Id
    private Integer id;
    private String productionNumber;
    private String productCode;
    private String name;
    private Integer amount;
    private String orderStatus;

    public ProductionVsAmount() {
    }

    public ProductionVsAmount(String productionNumber, String productCode, String name, Integer amount, String orderStatus) {
        this.productionNumber = productionNumber;
        this.productCode = productCode;
        this.name = name;
        this.amount = amount;
        this.orderStatus = orderStatus;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getProductionNumber() {
        return productionNumber;
    }

    public void setProductionNumber(String productionNumber) {
        this.productionNumber = productionNumber;
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

    public String getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }
}
