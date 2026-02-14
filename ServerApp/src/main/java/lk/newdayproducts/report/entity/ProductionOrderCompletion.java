package lk.newdayproducts.report.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class ProductionOrderCompletion {

    private Integer id;
    private String ordernumber;
    private String completepercentage;

    public ProductionOrderCompletion() {
    }

    public ProductionOrderCompletion(String ordernumber, String completepercentage) {
        this.ordernumber = ordernumber;
        this.completepercentage = completepercentage;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getOrdernumber() {
        return ordernumber;
    }

    public void setOrdernumber(String ordernumber) {
        this.ordernumber = ordernumber;
    }

    public String getCompletepercentage() {
        return completepercentage;
    }

    public void setCompletepercentage(String completepercentage) {
        this.completepercentage = completepercentage;
    }

    @Id
    public Integer getId() {
        return id;
    }


}
