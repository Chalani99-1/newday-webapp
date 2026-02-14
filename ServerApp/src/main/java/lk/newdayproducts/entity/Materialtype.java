package lk.newdayproducts.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.util.Collection;

@Entity
@Table(name = "materialtype")
public class Materialtype {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 45)
    @Column(name = "name", length = 45)
    private String name;

    @JsonIgnore
    @OneToMany(mappedBy = "materialtype")
    private Collection<Materialcategory> materialcategories ;

    @JsonIgnore
    @OneToMany(mappedBy = "materialtype")
    private Collection<Mcsize> mcSizes ;

    @JsonIgnore
    @OneToMany(mappedBy = "materialtype")
    private Collection<Rawmaterial> rawmaterials ;

    public Collection<Mcsize> getMcSizes() {
        return mcSizes;
    }

    public void setMcSizes(Collection<Mcsize> mcSizes) {
        this.mcSizes = mcSizes;
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

    public Collection<Materialcategory> getMaterialcategories() {
        return materialcategories;
    }

    public void setMaterialcategories(Collection<Materialcategory> materialcategories) {
        this.materialcategories = materialcategories;
    }

    public Collection<Rawmaterial> getRawmaterials() {
        return rawmaterials;
    }

    public void setRawmaterials(Collection<Rawmaterial> rawmaterials) {
        this.rawmaterials = rawmaterials;
    }
}