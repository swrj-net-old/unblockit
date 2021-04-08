package com.swrj.net.unblockit.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Squad.
 */
@Entity
@Table(name = "squad")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Squad implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "nome")
    private String nome;

    @OneToMany(mappedBy = "squadAgenda")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "coachAgenda", "squadAgenda" }, allowSetters = true)
    private Set<Agenda> agenda = new HashSet<>();

    @OneToMany(mappedBy = "squadTarefa")
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

    public Squad id(Long id) {
        this.id = id;
        return this;
    }

    public String getNome() {
        return this.nome;
    }

    public Squad nome(String nome) {
        this.nome = nome;
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Set<Agenda> getAgenda() {
        return this.agenda;
    }

    public Squad agenda(Set<Agenda> agenda) {
        this.setAgenda(agenda);
        return this;
    }

    public Squad addAgenda(Agenda agenda) {
        this.agenda.add(agenda);
        agenda.setSquadAgenda(this);
        return this;
    }

    public Squad removeAgenda(Agenda agenda) {
        this.agenda.remove(agenda);
        agenda.setSquadAgenda(null);
        return this;
    }

    public void setAgenda(Set<Agenda> agenda) {
        if (this.agenda != null) {
            this.agenda.forEach(i -> i.setSquadAgenda(null));
        }
        if (agenda != null) {
            agenda.forEach(i -> i.setSquadAgenda(this));
        }
        this.agenda = agenda;
    }

    public Set<Tarefa> getTarefas() {
        return this.tarefas;
    }

    public Squad tarefas(Set<Tarefa> tarefas) {
        this.setTarefas(tarefas);
        return this;
    }

    public Squad addTarefa(Tarefa tarefa) {
        this.tarefas.add(tarefa);
        tarefa.setSquadTarefa(this);
        return this;
    }

    public Squad removeTarefa(Tarefa tarefa) {
        this.tarefas.remove(tarefa);
        tarefa.setSquadTarefa(null);
        return this;
    }

    public void setTarefas(Set<Tarefa> tarefas) {
        if (this.tarefas != null) {
            this.tarefas.forEach(i -> i.setSquadTarefa(null));
        }
        if (tarefas != null) {
            tarefas.forEach(i -> i.setSquadTarefa(this));
        }
        this.tarefas = tarefas;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Squad)) {
            return false;
        }
        return id != null && id.equals(((Squad) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Squad{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            "}";
    }
}
