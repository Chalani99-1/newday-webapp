package lk.newdayproducts.report.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.math.BigDecimal;
import java.util.Date;

@Entity
public class ClientOrderCompletion {

    @Id
    private Integer id;
    private String number;
   private String percentage;

    public ClientOrderCompletion() {
    }

    public ClientOrderCompletion(Integer id, String number, String percentage) {
        this.id = id;
        this.number = number;
        this.percentage = percentage;
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

    public String getPercentage() {
        return percentage;
    }

    public void setPercentage(String percentage) {
        this.percentage = percentage;
    }
}
