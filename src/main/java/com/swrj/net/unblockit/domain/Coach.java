package com.swrj.net.unblockit.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Coach.
 */
@Entity
@Table(name = "coach")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Coach implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "nome")
    private String nome;

    @OneToMany(mappedBy = "coachAgenda")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "coachAgenda", "squadAgenda" }, allowSetters = true)
    private Set<Agenda> agenda = new HashSet<>();

    @OneToMany(mappedBy = "coachTarefa")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "coachTarefa", "squadTarefa" }, allowSetters = true)
    private Set<Tarefa> tarefas = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Coach id(Long id) {
        this.id = id;
        return this;
    }

    public String getNome() {
        return this.nome;
    }

    public Coach nome(String nome) {
        this.nome = nome;
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Set<Agenda> getAgenda() {
        return this.agenda;
    }

    public Coach agenda(Set<Agenda> agenda) {
        this.setAgenda(agenda);
        return this;
    }

    public Coach addAgenda(Agenda agenda) {
        this.agenda.add(agenda);
        agenda.setCoachAgenda(this);
        return this;
    }

    public Coach removeAgenda(Agenda agenda) {
        this.agenda.remove(agenda);
        agenda.setCoachAgenda(null);
        return this;
    }

    public void setAgenda(Set<Agenda> agenda) {
        if (this.agenda != null) {
            this.agenda.forEach(i -> i.setCoachAgenda(null));
        }
        if (agenda != null) {
            agenda.forEach(i -> i.setCoachAgenda(this));
        }
        this.agenda = agenda;
    }

    public Set<Tarefa> getTarefas() {
        return this.tarefas;
    }

    public Coach tarefas(Set<Tarefa> tarefas) {
        this.setTarefas(tarefas);
        return this;
    }

    public Coach addTarefa(Tarefa tarefa) {
        this.tarefas.add(tarefa);
        tarefa.setCoachTarefa(this);
        return this;
    }

    public Coach removeTarefa(Tarefa tarefa) {
        this.tarefas.remove(tarefa);
        tarefa.setCoachTarefa(null);
        return this;
    }

    public void setTarefas(Set<Tarefa> tarefas) {
        if (this.tarefas != null) {
            this.tarefas.forEach(i -> i.setCoachTarefa(null));
        }
        if (tarefas != null) {
            tarefas.forEach(i -> i.setCoachTarefa(this));
        }
        this.tarefas = tarefas;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Coach)) {
            return false;
        }
        return id != null && id.equals(((Coach) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Coach{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            "}";
    }
}
