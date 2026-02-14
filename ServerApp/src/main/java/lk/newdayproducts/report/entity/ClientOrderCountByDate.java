package lk.newdayproducts.report.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class ClientOrderCountByDate {

    private Integer id;
    private String clientName;
    private Long count;
    private double percentage;

    public ClientOrderCountByDate() {  }

    public ClientOrderCountByDate(String clientName, Long count) {
        this.clientName = clientName;
        this.count = count;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
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
