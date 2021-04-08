package com.swrj.net.unblockit.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.swrj.net.unblockit.domain.enumeration.SituacaoAgenda;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Agenda.
 */
@Entity
@Table(name = "agenda")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Agenda implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "nome")
    private String nome;

    @Column(name = "data_agenda")
    private LocalDate dataAgenda;

    @Column(name = "hora_inicio")
    private String horaInicio;

    @Column(name = "hora_fim")
    private String horaFim;

    @Enumerated(EnumType.STRING)
    @Column(name = "situacao_agenda")
    private SituacaoAgenda situacaoAgenda;

    @Column(name = "observacoes")
    private String observacoes;

    @Column(name = "pauta")
    private String pauta;

    @Column(name = "destaque")
    private String destaque;

    @Column(name = "impedimento")
    private String impedimento;

    @ManyToOne
    @JsonIgnoreProperties(value = { "agenda", "tarefas" }, allowSetters = true)
    private Coach coachAgenda;

    @ManyToOne
    @JsonIgnoreProperties(value = { "agenda", "tarefas" }, allowSetters = true)
    private Squad squadAgenda;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Agenda id(Long id) {
        this.id = id;
        return this;
    }

    public String getNome() {
        return this.nome;
    }

    public Agenda nome(String nome) {
        this.nome = nome;
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public LocalDate getDataAgenda() {
        return this.dataAgenda;
    }

    public Agenda dataAgenda(LocalDate dataAgenda) {
        this.dataAgenda = dataAgenda;
        return this;
    }

    public void setDataAgenda(LocalDate dataAgenda) {
        this.dataAgenda = dataAgenda;
    }

    public String getHoraInicio() {
        return this.horaInicio;
    }

    public Agenda horaInicio(String horaInicio) {
        this.horaInicio = horaInicio;
        return this;
    }

    public void setHoraInicio(String horaInicio) {
        this.horaInicio = horaInicio;
    }

    public String getHoraFim() {
        return this.horaFim;
    }

    public Agenda horaFim(String horaFim) {
        this.horaFim = horaFim;
        return this;
    }

    public void setHoraFim(String horaFim) {
        this.horaFim = horaFim;
    }

    public SituacaoAgenda getSituacaoAgenda() {
        return this.situacaoAgenda;
    }

    public Agenda situacaoAgenda(SituacaoAgenda situacaoAgenda) {
        this.situacaoAgenda = situacaoAgenda;
        return this;
    }

    public void setSituacaoAgenda(SituacaoAgenda situacaoAgenda) {
        this.situacaoAgenda = situacaoAgenda;
    }

    public String getObservacoes() {
        return this.observacoes;
    }

    public Agenda observacoes(String observacoes) {
        this.observacoes = observacoes;
        return this;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public String getPauta() {
        return this.pauta;
    }

    public Agenda pauta(String pauta) {
        this.pauta = pauta;
        return this;
    }

    public void setPauta(String pauta) {
        this.pauta = pauta;
    }

    public String getDestaque() {
        return this.destaque;
    }

    public Agenda destaque(String destaque) {
        this.destaque = destaque;
        return this;
    }

    public void setDestaque(String destaque) {
        this.destaque = destaque;
    }

    public String getImpedimento() {
        return this.impedimento;
    }

    public Agenda impedimento(String impedimento) {
        this.impedimento = impedimento;
        return this;
    }

    public void setImpedimento(String impedimento) {
        this.impedimento = impedimento;
    }

    public Coach getCoachAgenda() {
        return this.coachAgenda;
    }

    public Agenda coachAgenda(Coach coach) {
        this.setCoachAgenda(coach);
        return this;
    }

    public void setCoachAgenda(Coach coach) {
        this.coachAgenda = coach;
    }

    public Squad getSquadAgenda() {
        return this.squadAgenda;
    }

    public Agenda squadAgenda(Squad squad) {
        this.setSquadAgenda(squad);
        return this;
    }

    public void setSquadAgenda(Squad squad) {
        this.squadAgenda = squad;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Agenda)) {
            return false;
        }
        return id != null && id.equals(((Agenda) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Agenda{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", dataAgenda='" + getDataAgenda() + "'" +
            ", horaInicio='" + getHoraInicio() + "'" +
            ", horaFim='" + getHoraFim() + "'" +
            ", situacaoAgenda='" + getSituacaoAgenda() + "'" +
            ", observacoes='" + getObservacoes() + "'" +
            ", pauta='" + getPauta() + "'" +
            ", destaque='" + getDestaque() + "'" +
            ", impedimento='" + getImpedimento() + "'" +
            "}";
    }
}
