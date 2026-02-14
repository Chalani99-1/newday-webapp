package lk.newdayproducts.report.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.List;

@Entity
public class PurchaseOrderCountByDate {

    private Integer id;
    private String supplierName;
    private Long count;
    private double percentage;

    public PurchaseOrderCountByDate() {  }

    public PurchaseOrderCountByDate(String supplierName, Long count) {
        this.supplierName = supplierName;
        this.count = count;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }

    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Id
    public Integer getId() {
        return id;
    }


}
