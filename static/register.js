export default {
	props: ["create", "update"],
	data() {
		return {
			user: {status:"รอการสอบสัมภาษณ์", interviewdate:"20 พฤศจิกายน 2564"},
		}
	},
	mounted() {
		if (this.$props.update) {
			fetch("/me").then(reg => reg.json()).then(j => {
				this.$data.user = j;
			})
		}

	},
	methods: {

		createuser(formuser) {
			if(formuser.identity.value.length!=13){
				formuser.identity.setCustomValidity("หมายเลขประจำตัวประชาชนต้องมีจำนวน 13หลัก");
				formuser.reportValidity();
				return false;
			}else{
				formuser.identity.setCustomValidity("");
			}
			fetch(formuser.action, { method: formuser.method, body: new FormData(formuser) }).
				then(x => {
					if (x.ok) {
						if (this.$props.create) {
							this.$root.addRemoveElement("create","success","usermessage","การลงทะเบียนสำเร็จ :)", "text-success", "is-hidden")
							setTimeout(()=>{
								this.$root.reloadcookie();
								this.$router.push('/sign/in');
							},1500)
						}
						else {
							this.$root.addRemoveElement("edit","success","usermessage","การอัพเดทข้อมูลสำเร็จ :)", "text-success", "is-hidden");
						}


					} else {
						if (this.$props.create) {
							this.$root.addRemoveElement("create","error", "usermessage","เกิดข้อผิดพลาดในการลงทะเบียน :(", "text-error", "is-hidden")
							formuser.identity.setCustomValidity("หมายเลขประจำตัวประชาชนเคยถูกใช้ในการลงทะเบียนในระบบแล้ว")
							formuser.reportValidity()
						} 

						else {
							this.$root.addRemoveElement("edit","error", "usermessage", "เกิดข้อผิดพลาดในการอัพเดทข้อมูล :(", "text-error", "is-hidden")
						}
					}
				})
		}
	},
	template: `
  <form name="forminfo" method=post :action="create ? '/user/' : ('/user/' + user.identity)" @submit.prevent="createuser(event.target)">
	<table>
		<tr>
			<td><img alt="logo" width=150 src="/logo.png"></td>
			<td><h2 class=text-center>แบบฟอร์มการรับสมัคร</h2>
			<p class=text-center>สาขาวิชาวิทยาการคอมพิวเตอร์ มหาวิทยาลัยราชภัฏร้อยเอ็ด</p>
			<p class=text-center>ปีการศึกษา 2565</h3></p>
		</tr>
	</table>

	<fieldset :hidden="$root.user ? null : true">
		<legend>สถานะการสมัคร</legend>
		<label><span>สถานะ</span><input name="status" v-model="user.status" :readonly="update" class=info></label>
		<label><span>วันสอบสัมภาษณ์</span><input name="interviewdate" v-model="user.interviewdate" :readonly="update" class="info"></label>
	</fieldset>
	<fieldset v-bind:disabled="!(update||create)">
		<legend>ข้อมูลส่วนตัว</legend>
		<label><span>คำนำหน้า</span><select name="title" autocomplete="honorific-prefix" v-model="user.title"><option>นาย</option><option>นางสาว</option></select></label>
		<label><span>ชื่อ</span><input name="firstname" required autocomplete="given-name" v-model="user.firstname"></label>
		<label><span>นามสกุล</span><input name="lastname" required autocomplete="family-name" v-model="user.lastname"></label>
		<label><span>วันเกิด</span><input name="birthday" required autocomplete="bday" v-model="user.birthday" type=date max="2010-12-31"></label>
		<label><span>หมายเลขบัตรประจำตัวประชาชน</span><input name="identity" oninput="setCustomValidity('')" required autocomplete="" type=number v-model="user.identity" :readonly="update"></label>
	</fieldset>
	<fieldset v-bind:disabled="!(update||create)">
		<legend>ข้อมูลการศึกษา</legend>
		<label><span>ชื่อโรงเรียน</span><input name="schoolname" v-model="user.schoolname" required></label>
		<label><span>จังหวัด</span><input name="province" list="provinces" v-model="user.province" required></label>
		<datalist id=provinces><option>กรุงเทพมหานคร</option><option>อำนาจเจริญ</option><option>อ่างทอง</option><option>บึงกาฬ</option><option>บุรีรัมย์</option><option>ฉะเชิงเทรา</option><option>ชัยนาท</option><option>ชัยภูมิ</option><option>จันทบุรี</option><option>เชียงใหม่</option><option>เชียงราย</option><option>ชลบุรี</option><option>ชุมพร</option><option>กาฬสินธุ์</option><option>กำแพงเพชร</option><option>กาญจนบุรี</option><option>ขอนแก่น</option><option>กระบี่</option><option>ลำปาง</option><option>ลำพูน</option><option>เลย</option><option>ลพบุรี</option><option>แม่ฮ่องสอน</option><option>มหาสารคาม</option><option>มุกดาหาร</option><option>นครนายก</option><option>นครปฐม</option><option>นครพนม</option><option>นครราชสีมา</option><option>นครสวรรค์</option><option>นครศรีธรรมราช</option><option>น่าน</option><option>นราธิวาส</option><option>หนองบัวลำภู</option><option>หนองคาย</option><option>นนทบุรี</option><option>ปทุมธานี</option><option>ปัตตานี</option><option>พังงา</option><option>พัทลุง</option><option>พะเยา</option><option>เพชรบูรณ์</option><option>เพชรบุรี</option><option>พิจิตร</option><option>พิษณุโลก</option><option>พระนครศรีอยุธยา</option><option>แพร่</option><option>ภูเก็ต</option><option>ปราจีนบุรี</option><option>ประจวบคีรีขันธ์</option><option>ระนอง</option><option>ราชบุรี</option><option>ระยอง</option><option>ร้อยเอ็ด</option><option>สระแก้ว</option><option>สกลนคร</option><option>สมุทรปราการ</option><option>สมุทรสาคร</option><option>สมุทรสงคราม</option><option>สระบุรี</option><option>สตูล</option><option>สิงห์บุรี</option><option>ศรีสะเกษ</option><option>สงขลา</option><option>สุโขทัย</option><option>สุพรรณบุรี</option><option>สุราษฎร์ธานี</option><option>สุรินทร์</option><option>ตาก</option><option>ตรัง</option><option>ตราด</option><option>อุบลราชธานี</option><option>อุดรธานี</option><option>อุทัยธานี</option><option>อุตรดิตถ์</option><option>ยะลา</option><option>ยโสธร</option></datalist>
		<label><span>สายการเรียน</span>
		<input name="schoolopts" v-model="user.schoolopts"></label>
		<label><span>เกรดเฉลี่ยสะสม</span><input name="schoolnote" v-model="user.schoolnote"></label>
	</fieldset>
	<fieldset v-bind:disabled="!(update||create)">
		<legend>ข้อมูลติดต่อ</legend>
		<label><span>หมายเลขโทรศัพท์</span><input name="tel" type="tel" autocomplete="tel" v-model="user.tel" pattern="^0[0-9]{9}" oninvalid="this.setCustomValidity('โปรดกรอกเลขโทรศัพท์ที่ถูกต้อง 10 หลัก')"  oninput="setCustomValidity('')" required></label>
		<label><span>E-mail</span><input name="mail" type="email" autocomplete="email" v-model="user.mail" required></label>
		<label><span>Line ID (ถ้ามี)</span><input name="line" v-model="user.line" ></label>
		<label><span>Facebook ID (ถ้ามี)</span><input name="facebook" v-model="user.facebook" ></label>
	</fieldset>

	<div class="is-right row">
		<p id="usermessage" class="col-8 text-right is-hidden">{{this.$root.message}}</p>
		<input name="create" type=submit value=บันทึกข้อมูล v-if="create" class="col-3 button">
		<input name="edit" type=submit value=อัพเดทข้อมูล v-if="update" class="col-3 button">
	</div>
</form>`

}