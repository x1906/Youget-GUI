<template>
  <el-table ref="multipleTable" :data="download" tooltip-effect="dark" style="width: 100%;" :height="getHeight" @selection-change="handleSelectionChange">
    <el-table-column type="selection"></el-table-column>
    <el-table-column prop="name" label="名称" sortable>
    </el-table-column>
    <el-table-column prop="status" label="状态" sortable>
    </el-table-column>
    <el-table-column prop="speed" label="速度" sortable>
    </el-table-column>
    <el-table-column prop="size" label="大小" sortable>
    </el-table-column>
  </el-table>

</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      download: [{ name: 'Enpass_5.6.0_Setup.exe', status: '', speed: '', size: '30.9 MB' }],
    };
  },
  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
  computed: {
    ...mapGetters(['getHeight']),
  },
};

</script>

<style>

</style>
