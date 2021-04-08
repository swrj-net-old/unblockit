package com.swrj.net.unblockit.web.rest;

import com.swrj.net.unblockit.domain.Squad;
import com.swrj.net.unblockit.repository.SquadRepository;
import com.swrj.net.unblockit.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.swrj.net.unblockit.domain.Squad}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SquadResource {

    private final Logger log = LoggerFactory.getLogger(SquadResource.class);

    private static final String ENTITY_NAME = "squad";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SquadRepository squadRepository;

    public SquadResource(SquadRepository squadRepository) {
        this.squadRepository = squadRepository;
    }

    /**
     * {@code POST  /squads} : Create a new squad.
     *
     * @param squad the squad to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new squad, or with status {@code 400 (Bad Request)} if the squad has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/squads")
    public ResponseEntity<Squad> createSquad(@RequestBody Squad squad) throws URISyntaxException {
        log.debug("REST request to save Squad : {}", squad);
        if (squad.getId() != null) {
            throw new BadRequestAlertException("A new squad cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Squad result = squadRepository.save(squad);
        return ResponseEntity
            .created(new URI("/api/squads/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /squads/:id} : Updates an existing squad.
     *
     * @param id the id of the squad to save.
     * @param squad the squad to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated squad,
     * or with status {@code 400 (Bad Request)} if the squad is not valid,
     * or with status {@code 500 (Internal Server Error)} if the squad couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/squads/{id}")
    public ResponseEntity<Squad> updateSquad(@PathVariable(value = "id", required = false) final Long id, @RequestBody Squad squad)
        throws URISyntaxException {
        log.debug("REST request to update Squad : {}, {}", id, squad);
        if (squad.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, squad.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!squadRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Squad result = squadRepository.save(squad);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, squad.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /squads/:id} : Partial updates given fields of an existing squad, field will ignore if it is null
     *
     * @param id the id of the squad to save.
     * @param squad the squad to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated squad,
     * or with status {@code 400 (Bad Request)} if the squad is not valid,
     * or with status {@code 404 (Not Found)} if the squad is not found,
     * or with status {@code 500 (Internal Server Error)} if the squad couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/squads/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Squad> partialUpdateSquad(@PathVariable(value = "id", required = false) final Long id, @RequestBody Squad squad)
        throws URISyntaxException {
        log.debug("REST request to partial update Squad partially : {}, {}", id, squad);
        if (squad.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, squad.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!squadRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Squad> result = squadRepository
            .findById(squad.getId())
            .map(
                existingSquad -> {
                    if (squad.getNome() != null) {
                        existingSquad.setNome(squad.getNome());
                    }

                    return existingSquad;
                }
            )
            .map(squadRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, squad.getId().toString())
        );
    }

    /**
     * {@code GET  /squads} : get all the squads.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of squads in body.
     */
    @GetMapping("/squads")
    public List<Squad> getAllSquads() {
        log.debug("REST request to get all Squads");
        return squadRepository.findAll();
    }

    /**
     * {@code GET  /squads/:id} : get the "id" squad.
     *
     * @param id the id of the squad to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the squad, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/squads/{id}")
    public ResponseEntity<Squad> getSquad(@PathVariable Long id) {
        log.debug("REST request to get Squad : {}", id);
        Optional<Squad> squad = squadRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(squad);
    }

    /**
     * {@code DELETE  /squads/:id} : delete the "id" squad.
     *
     * @param id the id of the squad to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/squads/{id}")
    public ResponseEntity<Void> deleteSquad(@PathVariable Long id) {
        log.debug("REST request to delete Squad : {}", id);
        squadRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
