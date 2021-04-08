package com.swrj.net.unblockit.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.swrj.net.unblockit.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AgendaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Agenda.class);
        Agenda agenda1 = new Agenda();
        agenda1.setId(1L);
        Agenda agenda2 = new Agenda();
        agenda2.setId(agenda1.getId());
        assertThat(agenda1).isEqualTo(agenda2);
        agenda2.setId(2L);
        assertThat(agenda1).isNotEqualTo(agenda2);
        agenda1.setId(null);
        assertThat(agenda1).isNotEqualTo(agenda2);
    }
}
