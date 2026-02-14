package lk.newdayproducts.report.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class ProductionOrderVsAmount {

    @Id
    private Integer id;
    private String orderNumber;
    private String productCode;
    private String productName;
    private Integer amount;
    private Integer tocomplete;
    private String orderStatus;

    public ProductionOrderVsAmount() {
    }

    public ProductionOrderVsAmount(String orderNumber, String productCode, String productName, Integer amount, Integer tocomplete, String orderStatus) {
        this.orderNumber = orderNumber;
        this.productCode = productCode;
        this.productName = productName;
        this.amount = amount;
        this.tocomplete = tocomplete;
        this.orderStatus = orderStatus;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
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

    public Integer getTocomplete() {
        return tocomplete;
    }

    public void setTocomplete(Integer tocomplete) {
        this.tocomplete = tocomplete;
    }
}
