package lk.newdayproducts.report.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.math.BigDecimal;

@Entity
public class RawMatCount {

    @Id
    private Integer id;
    private String rmname;
    private BigDecimal qoh;
    private BigDecimal rop;

    public RawMatCount(String rmname, BigDecimal qoh, BigDecimal rop) {
        this.rmname = rmname;
        this.qoh = qoh;
        this.rop = rop;
    }

    public RawMatCount() {

    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getRmname() {
        return rmname;
    }

    public void setRmname(String rmname) {
        this.rmname = rmname;
    }

    public BigDecimal getQoh() {
        return qoh;
    }

    public void setQoh(BigDecimal qoh) {
        this.qoh = qoh;
    }

    public BigDecimal getRop() {
        return rop;
    }

    public void setRop(BigDecimal rop) {
        this.rop = rop;
    }
}
