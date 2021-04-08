package com.swrj.net.unblockit.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.swrj.net.unblockit.domain.enumeration.SituacaoTarefa;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Tarefa.
 */
@Entity
@Table(name = "tarefa")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Tarefa implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "nome")
    private String nome;

    @Column(name = "descricao")
    private String descricao;

    @Column(name = "data_limite")
    private LocalDate dataLimite;

    @Column(name = "hora_limite")
    private String horaLimite;

    @Enumerated(EnumType.STRING)
    @Column(name = "situacao_tarefa")
    private SituacaoTarefa situacaoTarefa;

    @Column(name = "observacoes")
    private String observacoes;

    @ManyToOne
    @JsonIgnoreProperties(value = { "agenda", "tarefas" }, allowSetters = true)
    private Coach coachTarefa;

    @ManyToOne
    @JsonIgnoreProperties(value = { "agenda", "tarefas" }, allowSetters = true)
    private Squad squadTarefa;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Tarefa id(Long id) {
        this.id = id;
        return this;
    }

    public String getNome() {
        return this.nome;
    }

    public Tarefa nome(String nome) {
        this.nome = nome;
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return this.descricao;
    }

    public Tarefa descricao(String descricao) {
        this.descricao = descricao;
        return this;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public LocalDate getDataLimite() {
        return this.dataLimite;
    }

    public Tarefa dataLimite(LocalDate dataLimite) {
        this.dataLimite = dataLimite;
        return this;
    }

    public void setDataLimite(LocalDate dataLimite) {
        this.dataLimite = dataLimite;
    }

    public String getHoraLimite() {
        return this.horaLimite;
    }

    public Tarefa horaLimite(String horaLimite) {
        this.horaLimite = horaLimite;
        return this;
    }

    public void setHoraLimite(String horaLimite) {
        this.horaLimite = horaLimite;
    }

    public SituacaoTarefa getSituacaoTarefa() {
        return this.situacaoTarefa;
    }

    public Tarefa situacaoTarefa(SituacaoTarefa situacaoTarefa) {
        this.situacaoTarefa = situacaoTarefa;
        return this;
    }

    public void setSituacaoTarefa(SituacaoTarefa situacaoTarefa) {
        this.situacaoTarefa = situacaoTarefa;
    }

    public String getObservacoes() {
        return this.observacoes;
    }

    public Tarefa observacoes(String observacoes) {
        this.observacoes = observacoes;
        return this;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public Coach getCoachTarefa() {
        return this.coachTarefa;
    }

    public Tarefa coachTarefa(Coach coach) {
        this.setCoachTarefa(coach);
        return this;
    }

    public void setCoachTarefa(Coach coach) {
        this.coachTarefa = coach;
    }

    public Squad getSquadTarefa() {
        return this.squadTarefa;
    }

    public Tarefa squadTarefa(Squad squad) {
        this.setSquadTarefa(squad);
        return this;
    }

    public void setSquadTarefa(Squad squad) {
        this.squadTarefa = squad;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Tarefa)) {
            return false;
        }
        return id != null && id.equals(((Tarefa) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Tarefa{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", descricao='" + getDescricao() + "'" +
            ", dataLimite='" + getDataLimite() + "'" +
            ", horaLimite='" + getHoraLimite() + "'" +
            ", situacaoTarefa='" + getSituacaoTarefa() + "'" +
            ", observacoes='" + getObservacoes() + "'" +
            "}";
    }
}
