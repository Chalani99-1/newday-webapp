package lk.newdayproducts.report.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class ProductionOrderCountByDate {

    private Integer id;
    private String productionOrderStatus;
    private Long count;
    private double percentage;

    public ProductionOrderCountByDate() {
    }

    public ProductionOrderCountByDate(String productionOrderStatus, Long count) {
        this.productionOrderStatus = productionOrderStatus;
        this.count = count;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getProductionOrderStatus() {
        return productionOrderStatus;
    }

    public void setProductionOrderStatus(String productionOrderStatus) {
        this.productionOrderStatus = productionOrderStatus;
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

    @Id
    public Integer getId() {
        return id;
    }


}
