package com.swrj.net.unblockit.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.swrj.net.unblockit.IntegrationTest;
import com.swrj.net.unblockit.domain.Tarefa;
import com.swrj.net.unblockit.domain.enumeration.SituacaoTarefa;
import com.swrj.net.unblockit.repository.TarefaRepository;
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
 * Integration tests for the {@link TarefaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TarefaResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRICAO = "AAAAAAAAAA";
    private static final String UPDATED_DESCRICAO = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATA_LIMITE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATA_LIMITE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_HORA_LIMITE = "AAAAAAAAAA";
    private static final String UPDATED_HORA_LIMITE = "BBBBBBBBBB";

    private static final SituacaoTarefa DEFAULT_SITUACAO_TAREFA = SituacaoTarefa.PENDENTE;
    private static final SituacaoTarefa UPDATED_SITUACAO_TAREFA = SituacaoTarefa.REALIZADA;

    private static final String DEFAULT_OBSERVACOES = "AAAAAAAAAA";
    private static final String UPDATED_OBSERVACOES = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/tarefas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TarefaRepository tarefaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTarefaMockMvc;

    private Tarefa tarefa;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Tarefa createEntity(EntityManager em) {
        Tarefa tarefa = new Tarefa()
            .nome(DEFAULT_NOME)
            .descricao(DEFAULT_DESCRICAO)
            .dataLimite(DEFAULT_DATA_LIMITE)
            .horaLimite(DEFAULT_HORA_LIMITE)
            .situacaoTarefa(DEFAULT_SITUACAO_TAREFA)
            .observacoes(DEFAULT_OBSERVACOES);
        return tarefa;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Tarefa createUpdatedEntity(EntityManager em) {
        Tarefa tarefa = new Tarefa()
            .nome(UPDATED_NOME)
            .descricao(UPDATED_DESCRICAO)
            .dataLimite(UPDATED_DATA_LIMITE)
            .horaLimite(UPDATED_HORA_LIMITE)
            .situacaoTarefa(UPDATED_SITUACAO_TAREFA)
            .observacoes(UPDATED_OBSERVACOES);
        return tarefa;
    }

    @BeforeEach
    public void initTest() {
        tarefa = createEntity(em);
    }

    @Test
    @Transactional
    void createTarefa() throws Exception {
        int databaseSizeBeforeCreate = tarefaRepository.findAll().size();
        // Create the Tarefa
        restTarefaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tarefa)))
            .andExpect(status().isCreated());

        // Validate the Tarefa in the database
        List<Tarefa> tarefaList = tarefaRepository.findAll();
        assertThat(tarefaList).hasSize(databaseSizeBeforeCreate + 1);
        Tarefa testTarefa = tarefaList.get(tarefaList.size() - 1);
        assertThat(testTarefa.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testTarefa.getDescricao()).isEqualTo(DEFAULT_DESCRICAO);
        assertThat(testTarefa.getDataLimite()).isEqualTo(DEFAULT_DATA_LIMITE);
        assertThat(testTarefa.getHoraLimite()).isEqualTo(DEFAULT_HORA_LIMITE);
        assertThat(testTarefa.getSituacaoTarefa()).isEqualTo(DEFAULT_SITUACAO_TAREFA);
        assertThat(testTarefa.getObservacoes()).isEqualTo(DEFAULT_OBSERVACOES);
    }

    @Test
    @Transactional
    void createTarefaWithExistingId() throws Exception {
        // Create the Tarefa with an existing ID
        tarefa.setId(1L);

        int databaseSizeBeforeCreate = tarefaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTarefaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tarefa)))
            .andExpect(status().isBadRequest());

        // Validate the Tarefa in the database
        List<Tarefa> tarefaList = tarefaRepository.findAll();
        assertThat(tarefaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTarefas() throws Exception {
        // Initialize the database
        tarefaRepository.saveAndFlush(tarefa);

        // Get all the tarefaList
        restTarefaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tarefa.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)))
            .andExpect(jsonPath("$.[*].descricao").value(hasItem(DEFAULT_DESCRICAO)))
            .andExpect(jsonPath("$.[*].dataLimite").value(hasItem(DEFAULT_DATA_LIMITE.toString())))
            .andExpect(jsonPath("$.[*].horaLimite").value(hasItem(DEFAULT_HORA_LIMITE)))
            .andExpect(jsonPath("$.[*].situacaoTarefa").value(hasItem(DEFAULT_SITUACAO_TAREFA.toString())))
            .andExpect(jsonPath("$.[*].observacoes").value(hasItem(DEFAULT_OBSERVACOES)));
    }

    @Test
    @Transactional
    void getTarefa() throws Exception {
        // Initialize the database
        tarefaRepository.saveAndFlush(tarefa);

        // Get the tarefa
        restTarefaMockMvc
            .perform(get(ENTITY_API_URL_ID, tarefa.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(tarefa.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME))
            .andExpect(jsonPath("$.descricao").value(DEFAULT_DESCRICAO))
            .andExpect(jsonPath("$.dataLimite").value(DEFAULT_DATA_LIMITE.toString()))
            .andExpect(jsonPath("$.horaLimite").value(DEFAULT_HORA_LIMITE))
            .andExpect(jsonPath("$.situacaoTarefa").value(DEFAULT_SITUACAO_TAREFA.toString()))
            .andExpect(jsonPath("$.observacoes").value(DEFAULT_OBSERVACOES));
    }

    @Test
    @Transactional
    void getNonExistingTarefa() throws Exception {
        // Get the tarefa
        restTarefaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTarefa() throws Exception {
        // Initialize the database
        tarefaRepository.saveAndFlush(tarefa);

        int databaseSizeBeforeUpdate = tarefaRepository.findAll().size();

        // Update the tarefa
        Tarefa updatedTarefa = tarefaRepository.findById(tarefa.getId()).get();
        // Disconnect from session so that the updates on updatedTarefa are not directly saved in db
        em.detach(updatedTarefa);
        updatedTarefa
            .nome(UPDATED_NOME)
            .descricao(UPDATED_DESCRICAO)
            .dataLimite(UPDATED_DATA_LIMITE)
            .horaLimite(UPDATED_HORA_LIMITE)
            .situacaoTarefa(UPDATED_SITUACAO_TAREFA)
            .observacoes(UPDATED_OBSERVACOES);

        restTarefaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTarefa.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTarefa))
            )
            .andExpect(status().isOk());

        // Validate the Tarefa in the database
        List<Tarefa> tarefaList = tarefaRepository.findAll();
        assertThat(tarefaList).hasSize(databaseSizeBeforeUpdate);
        Tarefa testTarefa = tarefaList.get(tarefaList.size() - 1);
        assertThat(testTarefa.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testTarefa.getDescricao()).isEqualTo(UPDATED_DESCRICAO);
        assertThat(testTarefa.getDataLimite()).isEqualTo(UPDATED_DATA_LIMITE);
        assertThat(testTarefa.getHoraLimite()).isEqualTo(UPDATED_HORA_LIMITE);
        assertThat(testTarefa.getSituacaoTarefa()).isEqualTo(UPDATED_SITUACAO_TAREFA);
        assertThat(testTarefa.getObservacoes()).isEqualTo(UPDATED_OBSERVACOES);
    }

    @Test
    @Transactional
    void putNonExistingTarefa() throws Exception {
        int databaseSizeBeforeUpdate = tarefaRepository.findAll().size();
        tarefa.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTarefaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, tarefa.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(tarefa))
            )
            .andExpect(status().isBadRequest());

        // Validate the Tarefa in the database
        List<Tarefa> tarefaList = tarefaRepository.findAll();
        assertThat(tarefaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTarefa() throws Exception {
        int databaseSizeBeforeUpdate = tarefaRepository.findAll().size();
        tarefa.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTarefaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(tarefa))
            )
            .andExpect(status().isBadRequest());

        // Validate the Tarefa in the database
        List<Tarefa> tarefaList = tarefaRepository.findAll();
        assertThat(tarefaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTarefa() throws Exception {
        int databaseSizeBeforeUpdate = tarefaRepository.findAll().size();
        tarefa.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTarefaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tarefa)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Tarefa in the database
        List<Tarefa> tarefaList = tarefaRepository.findAll();
        assertThat(tarefaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTarefaWithPatch() throws Exception {
        // Initialize the database
        tarefaRepository.saveAndFlush(tarefa);

        int databaseSizeBeforeUpdate = tarefaRepository.findAll().size();

        // Update the tarefa using partial update
        Tarefa partialUpdatedTarefa = new Tarefa();
        partialUpdatedTarefa.setId(tarefa.getId());

        partialUpdatedTarefa.nome(UPDATED_NOME).descricao(UPDATED_DESCRICAO).observacoes(UPDATED_OBSERVACOES);

        restTarefaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTarefa.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTarefa))
            )
            .andExpect(status().isOk());

        // Validate the Tarefa in the database
        List<Tarefa> tarefaList = tarefaRepository.findAll();
        assertThat(tarefaList).hasSize(databaseSizeBeforeUpdate);
        Tarefa testTarefa = tarefaList.get(tarefaList.size() - 1);
        assertThat(testTarefa.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testTarefa.getDescricao()).isEqualTo(UPDATED_DESCRICAO);
        assertThat(testTarefa.getDataLimite()).isEqualTo(DEFAULT_DATA_LIMITE);
        assertThat(testTarefa.getHoraLimite()).isEqualTo(DEFAULT_HORA_LIMITE);
        assertThat(testTarefa.getSituacaoTarefa()).isEqualTo(DEFAULT_SITUACAO_TAREFA);
        assertThat(testTarefa.getObservacoes()).isEqualTo(UPDATED_OBSERVACOES);
    }

    @Test
    @Transactional
    void fullUpdateTarefaWithPatch() throws Exception {
        // Initialize the database
        tarefaRepository.saveAndFlush(tarefa);

        int databaseSizeBeforeUpdate = tarefaRepository.findAll().size();

        // Update the tarefa using partial update
        Tarefa partialUpdatedTarefa = new Tarefa();
        partialUpdatedTarefa.setId(tarefa.getId());

        partialUpdatedTarefa
            .nome(UPDATED_NOME)
            .descricao(UPDATED_DESCRICAO)
            .dataLimite(UPDATED_DATA_LIMITE)
            .horaLimite(UPDATED_HORA_LIMITE)
            .situacaoTarefa(UPDATED_SITUACAO_TAREFA)
            .observacoes(UPDATED_OBSERVACOES);

        restTarefaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTarefa.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTarefa))
            )
            .andExpect(status().isOk());

        // Validate the Tarefa in the database
        List<Tarefa> tarefaList = tarefaRepository.findAll();
        assertThat(tarefaList).hasSize(databaseSizeBeforeUpdate);
        Tarefa testTarefa = tarefaList.get(tarefaList.size() - 1);
        assertThat(testTarefa.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testTarefa.getDescricao()).isEqualTo(UPDATED_DESCRICAO);
        assertThat(testTarefa.getDataLimite()).isEqualTo(UPDATED_DATA_LIMITE);
        assertThat(testTarefa.getHoraLimite()).isEqualTo(UPDATED_HORA_LIMITE);
        assertThat(testTarefa.getSituacaoTarefa()).isEqualTo(UPDATED_SITUACAO_TAREFA);
        assertThat(testTarefa.getObservacoes()).isEqualTo(UPDATED_OBSERVACOES);
    }

    @Test
    @Transactional
    void patchNonExistingTarefa() throws Exception {
        int databaseSizeBeforeUpdate = tarefaRepository.findAll().size();
        tarefa.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTarefaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, tarefa.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(tarefa))
            )
            .andExpect(status().isBadRequest());

        // Validate the Tarefa in the database
        List<Tarefa> tarefaList = tarefaRepository.findAll();
        assertThat(tarefaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTarefa() throws Exception {
        int databaseSizeBeforeUpdate = tarefaRepository.findAll().size();
        tarefa.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTarefaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(tarefa))
            )
            .andExpect(status().isBadRequest());

        // Validate the Tarefa in the database
        List<Tarefa> tarefaList = tarefaRepository.findAll();
        assertThat(tarefaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTarefa() throws Exception {
        int databaseSizeBeforeUpdate = tarefaRepository.findAll().size();
        tarefa.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTarefaMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(tarefa)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Tarefa in the database
        List<Tarefa> tarefaList = tarefaRepository.findAll();
        assertThat(tarefaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTarefa() throws Exception {
        // Initialize the database
        tarefaRepository.saveAndFlush(tarefa);

        int databaseSizeBeforeDelete = tarefaRepository.findAll().size();

        // Delete the tarefa
        restTarefaMockMvc
            .perform(delete(ENTITY_API_URL_ID, tarefa.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Tarefa> tarefaList = tarefaRepository.findAll();
        assertThat(tarefaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
