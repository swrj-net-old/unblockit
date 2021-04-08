package com.swrj.net.unblockit.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.swrj.net.unblockit.IntegrationTest;
import com.swrj.net.unblockit.domain.Squad;
import com.swrj.net.unblockit.repository.SquadRepository;
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
 * Integration tests for the {@link SquadResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SquadResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/squads";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SquadRepository squadRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSquadMockMvc;

    private Squad squad;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Squad createEntity(EntityManager em) {
        Squad squad = new Squad().nome(DEFAULT_NOME);
        return squad;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Squad createUpdatedEntity(EntityManager em) {
        Squad squad = new Squad().nome(UPDATED_NOME);
        return squad;
    }

    @BeforeEach
    public void initTest() {
        squad = createEntity(em);
    }

    @Test
    @Transactional
    void createSquad() throws Exception {
        int databaseSizeBeforeCreate = squadRepository.findAll().size();
        // Create the Squad
        restSquadMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(squad)))
            .andExpect(status().isCreated());

        // Validate the Squad in the database
        List<Squad> squadList = squadRepository.findAll();
        assertThat(squadList).hasSize(databaseSizeBeforeCreate + 1);
        Squad testSquad = squadList.get(squadList.size() - 1);
        assertThat(testSquad.getNome()).isEqualTo(DEFAULT_NOME);
    }

    @Test
    @Transactional
    void createSquadWithExistingId() throws Exception {
        // Create the Squad with an existing ID
        squad.setId(1L);

        int databaseSizeBeforeCreate = squadRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSquadMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(squad)))
            .andExpect(status().isBadRequest());

        // Validate the Squad in the database
        List<Squad> squadList = squadRepository.findAll();
        assertThat(squadList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSquads() throws Exception {
        // Initialize the database
        squadRepository.saveAndFlush(squad);

        // Get all the squadList
        restSquadMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(squad.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)));
    }

    @Test
    @Transactional
    void getSquad() throws Exception {
        // Initialize the database
        squadRepository.saveAndFlush(squad);

        // Get the squad
        restSquadMockMvc
            .perform(get(ENTITY_API_URL_ID, squad.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(squad.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME));
    }

    @Test
    @Transactional
    void getNonExistingSquad() throws Exception {
        // Get the squad
        restSquadMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSquad() throws Exception {
        // Initialize the database
        squadRepository.saveAndFlush(squad);

        int databaseSizeBeforeUpdate = squadRepository.findAll().size();

        // Update the squad
        Squad updatedSquad = squadRepository.findById(squad.getId()).get();
        // Disconnect from session so that the updates on updatedSquad are not directly saved in db
        em.detach(updatedSquad);
        updatedSquad.nome(UPDATED_NOME);

        restSquadMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSquad.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSquad))
            )
            .andExpect(status().isOk());

        // Validate the Squad in the database
        List<Squad> squadList = squadRepository.findAll();
        assertThat(squadList).hasSize(databaseSizeBeforeUpdate);
        Squad testSquad = squadList.get(squadList.size() - 1);
        assertThat(testSquad.getNome()).isEqualTo(UPDATED_NOME);
    }

    @Test
    @Transactional
    void putNonExistingSquad() throws Exception {
        int databaseSizeBeforeUpdate = squadRepository.findAll().size();
        squad.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSquadMockMvc
            .perform(
                put(ENTITY_API_URL_ID, squad.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(squad))
            )
            .andExpect(status().isBadRequest());

        // Validate the Squad in the database
        List<Squad> squadList = squadRepository.findAll();
        assertThat(squadList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSquad() throws Exception {
        int databaseSizeBeforeUpdate = squadRepository.findAll().size();
        squad.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSquadMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(squad))
            )
            .andExpect(status().isBadRequest());

        // Validate the Squad in the database
        List<Squad> squadList = squadRepository.findAll();
        assertThat(squadList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSquad() throws Exception {
        int databaseSizeBeforeUpdate = squadRepository.findAll().size();
        squad.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSquadMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(squad)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Squad in the database
        List<Squad> squadList = squadRepository.findAll();
        assertThat(squadList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSquadWithPatch() throws Exception {
        // Initialize the database
        squadRepository.saveAndFlush(squad);

        int databaseSizeBeforeUpdate = squadRepository.findAll().size();

        // Update the squad using partial update
        Squad partialUpdatedSquad = new Squad();
        partialUpdatedSquad.setId(squad.getId());

        restSquadMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSquad.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSquad))
            )
            .andExpect(status().isOk());

        // Validate the Squad in the database
        List<Squad> squadList = squadRepository.findAll();
        assertThat(squadList).hasSize(databaseSizeBeforeUpdate);
        Squad testSquad = squadList.get(squadList.size() - 1);
        assertThat(testSquad.getNome()).isEqualTo(DEFAULT_NOME);
    }

    @Test
    @Transactional
    void fullUpdateSquadWithPatch() throws Exception {
        // Initialize the database
        squadRepository.saveAndFlush(squad);

        int databaseSizeBeforeUpdate = squadRepository.findAll().size();

        // Update the squad using partial update
        Squad partialUpdatedSquad = new Squad();
        partialUpdatedSquad.setId(squad.getId());

        partialUpdatedSquad.nome(UPDATED_NOME);

        restSquadMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSquad.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSquad))
            )
            .andExpect(status().isOk());

        // Validate the Squad in the database
        List<Squad> squadList = squadRepository.findAll();
        assertThat(squadList).hasSize(databaseSizeBeforeUpdate);
        Squad testSquad = squadList.get(squadList.size() - 1);
        assertThat(testSquad.getNome()).isEqualTo(UPDATED_NOME);
    }

    @Test
    @Transactional
    void patchNonExistingSquad() throws Exception {
        int databaseSizeBeforeUpdate = squadRepository.findAll().size();
        squad.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSquadMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, squad.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(squad))
            )
            .andExpect(status().isBadRequest());

        // Validate the Squad in the database
        List<Squad> squadList = squadRepository.findAll();
        assertThat(squadList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSquad() throws Exception {
        int databaseSizeBeforeUpdate = squadRepository.findAll().size();
        squad.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSquadMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(squad))
            )
            .andExpect(status().isBadRequest());

        // Validate the Squad in the database
        List<Squad> squadList = squadRepository.findAll();
        assertThat(squadList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSquad() throws Exception {
        int databaseSizeBeforeUpdate = squadRepository.findAll().size();
        squad.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSquadMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(squad)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Squad in the database
        List<Squad> squadList = squadRepository.findAll();
        assertThat(squadList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSquad() throws Exception {
        // Initialize the database
        squadRepository.saveAndFlush(squad);

        int databaseSizeBeforeDelete = squadRepository.findAll().size();

        // Delete the squad
        restSquadMockMvc
            .perform(delete(ENTITY_API_URL_ID, squad.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Squad> squadList = squadRepository.findAll();
        assertThat(squadList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
