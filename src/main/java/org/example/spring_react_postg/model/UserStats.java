package org.example.spring_react_postg.model;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.Type;
//import org.hibernate.annotations.TypeDef;
//import org.hibernate.annotations.TypeDefs;
import org.hibernate.type.SqlTypes;


import java.util.HashMap;
import java.util.Map;


@Entity
@Table(name = "stat")
@NoArgsConstructor
@AllArgsConstructor
public class UserStats {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;


    @Type(JsonBinaryType.class)
    @Column(columnDefinition = "jsonb", nullable = false)
    private Map<String, DailyStats> activity;
//    {
//        data: {
//            reviewed: ,
//            durationSeconds: ,
//            added:
//        },
//    }




    @PrePersist
    protected void onCreate() {
        if (activity == null) {
            activity = new HashMap<>();
        }
    }
//




    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Map<String, DailyStats> getActivity() {
        return activity;
    }

    public void setActivity(Map<String, DailyStats> activity) {
        this.activity = activity;
    }
}
