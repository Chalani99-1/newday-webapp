package lk.newdayproducts.report.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.math.BigDecimal;

@Entity
public class RawmaterialUsage {

    @Id
    private Integer id;
    private Integer rawmaterialid;
    private String rawmaterialname;
    private byte[] photo;
    private BigDecimal count;


    public RawmaterialUsage() {
    }

    public RawmaterialUsage(Integer rawmaterialid, String rawmaterialname, byte[] photo, BigDecimal count) {
        this.rawmaterialid = rawmaterialid;
        this.rawmaterialname = rawmaterialname;
        this.photo = photo;
        this.count = count;
    }

    public byte[] getPhoto() {
        return photo;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getRawmaterialid() {
        return rawmaterialid;
    }

    public void setRawmaterialid(Integer rawmaterialid) {
        this.rawmaterialid = rawmaterialid;
    }

    public String getRawmaterialname() {
        return rawmaterialname;
    }

    public void setRawmaterialname(String rawmaterialname) {
        this.rawmaterialname = rawmaterialname;
    }

    public BigDecimal getCount() {
        return count;
    }

    public void setCount(BigDecimal count) {
        this.count = count;
    }

   }
