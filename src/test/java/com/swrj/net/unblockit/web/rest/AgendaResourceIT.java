package com.swrj.net.unblockit.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.swrj.net.unblockit.IntegrationTest;
import com.swrj.net.unblockit.domain.Agenda;
import com.swrj.net.unblockit.domain.enumeration.SituacaoAgenda;
import com.swrj.net.unblockit.repository.AgendaRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link AgendaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AgendaResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATA_AGENDA = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATA_AGENDA = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_HORA_INICIO = "AAAAAAAAAA";
    private static final String UPDATED_HORA_INICIO = "BBBBBBBBBB";

    private static final String DEFAULT_HORA_FIM = "AAAAAAAAAA";
    private static final String UPDATED_HORA_FIM = "BBBBBBBBBB";

    private static final SituacaoAgenda DEFAULT_SITUACAO_AGENDA = SituacaoAgenda.RESERVADA;
    private static final SituacaoAgenda UPDATED_SITUACAO_AGENDA = SituacaoAgenda.CONFIRMADA;

    private static final String DEFAULT_OBSERVACOES = "AAAAAAAAAA";
    private static final String UPDATED_OBSERVACOES = "BBBBBBBBBB";

    private static final String DEFAULT_PAUTA = "AAAAAAAAAA";
    private static final String UPDATED_PAUTA = "BBBBBBBBBB";

    private static final String DEFAULT_DESTAQUE = "AAAAAAAAAA";
    private static final String UPDATED_DESTAQUE = "BBBBBBBBBB";

    private static final String DEFAULT_IMPEDIMENTO = "AAAAAAAAAA";
    private static final String UPDATED_IMPEDIMENTO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/agenda";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AgendaRepository agendaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAgendaMockMvc;

    private Agenda agenda;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Agenda createEntity(EntityManager em) {
        Agenda agenda = new Agenda()
            .nome(DEFAULT_NOME)
            .dataAgenda(DEFAULT_DATA_AGENDA)
            .horaInicio(DEFAULT_HORA_INICIO)
            .horaFim(DEFAULT_HORA_FIM)
            .situacaoAgenda(DEFAULT_SITUACAO_AGENDA)
            .observacoes(DEFAULT_OBSERVACOES)
            .pauta(DEFAULT_PAUTA)
            .destaque(DEFAULT_DESTAQUE)
            .impedimento(DEFAULT_IMPEDIMENTO);
        return agenda;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Agenda createUpdatedEntity(EntityManager em) {
        Agenda agenda = new Agenda()
            .nome(UPDATED_NOME)
            .dataAgenda(UPDATED_DATA_AGENDA)
            .horaInicio(UPDATED_HORA_INICIO)
            .horaFim(UPDATED_HORA_FIM)
            .situacaoAgenda(UPDATED_SITUACAO_AGENDA)
            .observacoes(UPDATED_OBSERVACOES)
            .pauta(UPDATED_PAUTA)
            .destaque(UPDATED_DESTAQUE)
            .impedimento(UPDATED_IMPEDIMENTO);
        return agenda;
    }

    @BeforeEach
    public void initTest() {
        agenda = createEntity(em);
    }

    @Test
    @Transactional
    void createAgenda() throws Exception {
        int databaseSizeBeforeCreate = agendaRepository.findAll().size();
        // Create the Agenda
        restAgendaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(agenda)))
            .andExpect(status().isCreated());

        // Validate the Agenda in the database
        List<Agenda> agendaList = agendaRepository.findAll();
        assertThat(agendaList).hasSize(databaseSizeBeforeCreate + 1);
        Agenda testAgenda = agendaList.get(agendaList.size() - 1);
        assertThat(testAgenda.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testAgenda.getDataAgenda()).isEqualTo(DEFAULT_DATA_AGENDA);
        assertThat(testAgenda.getHoraInicio()).isEqualTo(DEFAULT_HORA_INICIO);
        assertThat(testAgenda.getHoraFim()).isEqualTo(DEFAULT_HORA_FIM);
        assertThat(testAgenda.getSituacaoAgenda()).isEqualTo(DEFAULT_SITUACAO_AGENDA);
        assertThat(testAgenda.getObservacoes()).isEqualTo(DEFAULT_OBSERVACOES);
        assertThat(testAgenda.getPauta()).isEqualTo(DEFAULT_PAUTA);
        assertThat(testAgenda.getDestaque()).isEqualTo(DEFAULT_DESTAQUE);
        assertThat(testAgenda.getImpedimento()).isEqualTo(DEFAULT_IMPEDIMENTO);
    }

    @Test
    @Transactional
    void createAgendaWithExistingId() throws Exception {
        // Create the Agenda with an existing ID
        agenda.setId(1L);

        int databaseSizeBeforeCreate = agendaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAgendaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(agenda)))
            .andExpect(status().isBadRequest());

        // Validate the Agenda in the database
        List<Agenda> agendaList = agendaRepository.findAll();
        assertThat(agendaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAgenda() throws Exception {
        // Initialize the database
        agendaRepository.saveAndFlush(agenda);

        // Get all the agendaList
        restAgendaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(agenda.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)))
            .andExpect(jsonPath("$.[*].dataAgenda").value(hasItem(DEFAULT_DATA_AGENDA.toString())))
            .andExpect(jsonPath("$.[*].horaInicio").value(hasItem(DEFAULT_HORA_INICIO)))
            .andExpect(jsonPath("$.[*].horaFim").value(hasItem(DEFAULT_HORA_FIM)))
            .andExpect(jsonPath("$.[*].situacaoAgenda").value(hasItem(DEFAULT_SITUACAO_AGENDA.toString())))
            .andExpect(jsonPath("$.[*].observacoes").value(hasItem(DEFAULT_OBSERVACOES)))
            .andExpect(jsonPath("$.[*].pauta").value(hasItem(DEFAULT_PAUTA)))
            .andExpect(jsonPath("$.[*].destaque").value(hasItem(DEFAULT_DESTAQUE)))
            .andExpect(jsonPath("$.[*].impedimento").value(hasItem(DEFAULT_IMPEDIMENTO)));
    }

    @Test
    @Transactional
    void getAgenda() throws Exception {
        // Initialize the database
        agendaRepository.saveAndFlush(agenda);

        // Get the agenda
        restAgendaMockMvc
            .perform(get(ENTITY_API_URL_ID, agenda.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(agenda.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME))
            .andExpect(jsonPath("$.dataAgenda").value(DEFAULT_DATA_AGENDA.toString()))
            .andExpect(jsonPath("$.horaInicio").value(DEFAULT_HORA_INICIO))
            .andExpect(jsonPath("$.horaFim").value(DEFAULT_HORA_FIM))
            .andExpect(jsonPath("$.situacaoAgenda").value(DEFAULT_SITUACAO_AGENDA.toString()))
            .andExpect(jsonPath("$.observacoes").value(DEFAULT_OBSERVACOES))
            .andExpect(jsonPath("$.pauta").value(DEFAULT_PAUTA))
            .andExpect(jsonPath("$.destaque").value(DEFAULT_DESTAQUE))
            .andExpect(jsonPath("$.impedimento").value(DEFAULT_IMPEDIMENTO));
    }

    @Test
    @Transactional
    void getNonExistingAgenda() throws Exception {
        // Get the agenda
        restAgendaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAgenda() throws Exception {
        // Initialize the database
        agendaRepository.saveAndFlush(agenda);

        int databaseSizeBeforeUpdate = agendaRepository.findAll().size();

        // Update the agenda
        Agenda updatedAgenda = agendaRepository.findById(agenda.getId()).get();
        // Disconnect from session so that the updates on updatedAgenda are not directly saved in db
        em.detach(updatedAgenda);
        updatedAgenda
            .nome(UPDATED_NOME)
            .dataAgenda(UPDATED_DATA_AGENDA)
            .horaInicio(UPDATED_HORA_INICIO)
            .horaFim(UPDATED_HORA_FIM)
            .situacaoAgenda(UPDATED_SITUACAO_AGENDA)
            .observacoes(UPDATED_OBSERVACOES)
            .pauta(UPDATED_PAUTA)
            .destaque(UPDATED_DESTAQUE)
            .impedimento(UPDATED_IMPEDIMENTO);

        restAgendaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAgenda.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAgenda))
            )
            .andExpect(status().isOk());

        // Validate the Agenda in the database
        List<Agenda> agendaList = agendaRepository.findAll();
        assertThat(agendaList).hasSize(databaseSizeBeforeUpdate);
        Agenda testAgenda = agendaList.get(agendaList.size() - 1);
        assertThat(testAgenda.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testAgenda.getDataAgenda()).isEqualTo(UPDATED_DATA_AGENDA);
        assertThat(testAgenda.getHoraInicio()).isEqualTo(UPDATED_HORA_INICIO);
        assertThat(testAgenda.getHoraFim()).isEqualTo(UPDATED_HORA_FIM);
        assertThat(testAgenda.getSituacaoAgenda()).isEqualTo(UPDATED_SITUACAO_AGENDA);
        assertThat(testAgenda.getObservacoes()).isEqualTo(UPDATED_OBSERVACOES);
        assertThat(testAgenda.getPauta()).isEqualTo(UPDATED_PAUTA);
        assertThat(testAgenda.getDestaque()).isEqualTo(UPDATED_DESTAQUE);
        assertThat(testAgenda.getImpedimento()).isEqualTo(UPDATED_IMPEDIMENTO);
    }

    @Test
    @Transactional
    void putNonExistingAgenda() throws Exception {
        int databaseSizeBeforeUpdate = agendaRepository.findAll().size();
        agenda.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAgendaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, agenda.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(agenda))
            )
            .andExpect(status().isBadRequest());

        // Validate the Agenda in the database
        List<Agenda> agendaList = agendaRepository.findAll();
        assertThat(agendaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAgenda() throws Exception {
        int databaseSizeBeforeUpdate = agendaRepository.findAll().size();
        agenda.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAgendaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(agenda))
            )
            .andExpect(status().isBadRequest());

        // Validate the Agenda in the database
        List<Agenda> agendaList = agendaRepository.findAll();
        assertThat(agendaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAgenda() throws Exception {
        int databaseSizeBeforeUpdate = agendaRepository.findAll().size();
        agenda.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAgendaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(agenda)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Agenda in the database
        List<Agenda> agendaList = agendaRepository.findAll();
        assertThat(agendaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAgendaWithPatch() throws Exception {
        // Initialize the database
        agendaRepository.saveAndFlush(agenda);

        int databaseSizeBeforeUpdate = agendaRepository.findAll().size();

        // Update the agenda using partial update
        Agenda partialUpdatedAgenda = new Agenda();
        partialUpdatedAgenda.setId(agenda.getId());

        partialUpdatedAgenda.nome(UPDATED_NOME).situacaoAgenda(UPDATED_SITUACAO_AGENDA).impedimento(UPDATED_IMPEDIMENTO);

        restAgendaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAgenda.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAgenda))
            )
            .andExpect(status().isOk());

        // Validate the Agenda in the database
        List<Agenda> agendaList = agendaRepository.findAll();
        assertThat(agendaList).hasSize(databaseSizeBeforeUpdate);
        Agenda testAgenda = agendaList.get(agendaList.size() - 1);
        assertThat(testAgenda.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testAgenda.getDataAgenda()).isEqualTo(DEFAULT_DATA_AGENDA);
        assertThat(testAgenda.getHoraInicio()).isEqualTo(DEFAULT_HORA_INICIO);
        assertThat(testAgenda.getHoraFim()).isEqualTo(DEFAULT_HORA_FIM);
        assertThat(testAgenda.getSituacaoAgenda()).isEqualTo(UPDATED_SITUACAO_AGENDA);
        assertThat(testAgenda.getObservacoes()).isEqualTo(DEFAULT_OBSERVACOES);
        assertThat(testAgenda.getPauta()).isEqualTo(DEFAULT_PAUTA);
        assertThat(testAgenda.getDestaque()).isEqualTo(DEFAULT_DESTAQUE);
        assertThat(testAgenda.getImpedimento()).isEqualTo(UPDATED_IMPEDIMENTO);
    }

    @Test
    @Transactional
    void fullUpdateAgendaWithPatch() throws Exception {
        // Initialize the database
        agendaRepository.saveAndFlush(agenda);

        int databaseSizeBeforeUpdate = agendaRepository.findAll().size();

        // Update the agenda using partial update
        Agenda partialUpdatedAgenda = new Agenda();
        partialUpdatedAgenda.setId(agenda.getId());

        partialUpdatedAgenda
            .nome(UPDATED_NOME)
            .dataAgenda(UPDATED_DATA_AGENDA)
            .horaInicio(UPDATED_HORA_INICIO)
            .horaFim(UPDATED_HORA_FIM)
            .situacaoAgenda(UPDATED_SITUACAO_AGENDA)
            .observacoes(UPDATED_OBSERVACOES)
            .pauta(UPDATED_PAUTA)
            .destaque(UPDATED_DESTAQUE)
            .impedimento(UPDATED_IMPEDIMENTO);

        restAgendaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAgenda.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAgenda))
            )
            .andExpect(status().isOk());

        // Validate the Agenda in the database
        List<Agenda> agendaList = agendaRepository.findAll();
        assertThat(agendaList).hasSize(databaseSizeBeforeUpdate);
        Agenda testAgenda = agendaList.get(agendaList.size() - 1);
        assertThat(testAgenda.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testAgenda.getDataAgenda()).isEqualTo(UPDATED_DATA_AGENDA);
        assertThat(testAgenda.getHoraInicio()).isEqualTo(UPDATED_HORA_INICIO);
        assertThat(testAgenda.getHoraFim()).isEqualTo(UPDATED_HORA_FIM);
        assertThat(testAgenda.getSituacaoAgenda()).isEqualTo(UPDATED_SITUACAO_AGENDA);
        assertThat(testAgenda.getObservacoes()).isEqualTo(UPDATED_OBSERVACOES);
        assertThat(testAgenda.getPauta()).isEqualTo(UPDATED_PAUTA);
        assertThat(testAgenda.getDestaque()).isEqualTo(UPDATED_DESTAQUE);
        assertThat(testAgenda.getImpedimento()).isEqualTo(UPDATED_IMPEDIMENTO);
    }

    @Test
    @Transactional
    void patchNonExistingAgenda() throws Exception {
        int databaseSizeBeforeUpdate = agendaRepository.findAll().size();
        agenda.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAgendaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, agenda.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(agenda))
            )
            .andExpect(status().isBadRequest());

        // Validate the Agenda in the database
        List<Agenda> agendaList = agendaRepository.findAll();
        assertThat(agendaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAgenda() throws Exception {
        int databaseSizeBeforeUpdate = agendaRepository.findAll().size();
        agenda.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAgendaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(agenda))
            )
            .andExpect(status().isBadRequest());

        // Validate the Agenda in the database
        List<Agenda> agendaList = agendaRepository.findAll();
        assertThat(agendaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAgenda() throws Exception {
        int databaseSizeBeforeUpdate = agendaRepository.findAll().size();
        agenda.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAgendaMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(agenda)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Agenda in the database
        List<Agenda> agendaList = agendaRepository.findAll();
        assertThat(agendaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAgenda() throws Exception {
        // Initialize the database
        agendaRepository.saveAndFlush(agenda);

        int databaseSizeBeforeDelete = agendaRepository.findAll().size();

        // Delete the agenda
        restAgendaMockMvc
            .perform(delete(ENTITY_API_URL_ID, agenda.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Agenda> agendaList = agendaRepository.findAll();
        assertThat(agendaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
