package lk.newdayproducts.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Collection;

@Entity
@Table(name = "mcsize")
public class Mcsize {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "name")
    private String name;

    @ManyToOne()
    @JoinColumn(name = "materialtype_id", nullable = false)
    private Materialtype materialtype;

    @JsonIgnore
    @OneToMany(mappedBy = "mcsize")
    private Collection<Materialcategory> materialcategories;


    public Materialtype getMaterialtype() {
        return materialtype;
    }

    public void setMaterialtype(Materialtype materialtype) {
        this.materialtype = materialtype;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Mcsize that = (Mcsize) o;

        if (id != null ? !id.equals(that.id) : that.id != null) return false;
        if (name != null ? !name.equals(that.name) : that.name != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (name != null ? name.hashCode() : 0);
        return result;
    }

    public Collection<Materialcategory> getMaterialcategories() {
        return materialcategories;
    }

    public void setMaterialcategories(Collection<Materialcategory> materialcategories) {
        this.materialcategories = materialcategories;
    }
}
