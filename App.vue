<script>
	import {byModelsSetAction} from "./helpers";
  import {mapMutations} from 'vuex'

  export default {
		onLaunch: function() {
      this.getHeight()
		},
		onShow: function() {
		},
		onHide: function() {
		},
    methods: {
      ...mapMutations(['setOperationHeight']),
      async getHeight() {
        const success = await byModelsSetAction()
        if (success) {
          this.setOperationHeight(success)
        }
      }
    }
	}
</script>

<style>
page {
  background: #F6F6F6;
}
	/*每个页面公共css */
</style>
