var Profils = {
	powerInstance: null,

	init: function(powerInstance) {
		this.powerInstance = powerInstance;
	},
	getProfils: function() {
		var profils = localStorage.getItem('powerci');

		if (profils)
			return JSON.parse(profils);
		else
			return null;
	},
	saveProfil: function(profils) {
		localStorage.setItem('powerci', JSON.stringify(profils));
	},
	getProfil: function(name) {
		var profils = this.getProfils();
		var profil = null;

		if (profils) {
			$.each(profils, function(i, elem) {
				if (elem.name == name)
					profil = elem;
			});
			return profil;
		}
		return null;
	},
	newProfil: function(profilName, searchQuery) {
		var profil = {
			'name': profilName,
			'query': JSON.stringify(searchQuery)
		};
		var profils = this.getProfils();

		if (!profils) {
			profils = Array(profil);
		} else {
			profils.push(profil);
		}
		this.saveProfil(profils);
		this.displayProfils();
	},
	displayProfils: function() {
		var profils = this.getProfils();
		var me = this;

		$('#profilList').html('');
		$('#profilTable').html('');
		if (profils) {
			$.each(profils, function(i, elem) {
				$('#profilList').append('<li><a query="' + elem.name + '" class="profilElem"><i class="fa fa-cube"></i>' + elem.name + '</a></li>');
				$('#profilTable').append('<tr><td>' + elem.name + '</td><td class="text-center"><a query="' + elem.name + '" class="removeProfil"><i class="fa fa-trash"></i> Supprimer</a></td></tr>');
			});
		}

		$('.removeProfil').click(function() {
			var profils = me.getProfils();

			if (profils) {
				var index = -1
				var i = 0;
				while (i < profils.length) {
					if (profils[i].name == $(this).attr('query')) {
						index = i;
						break;
					}
					i++;
				}
				if (index > -1) {
					profils.splice(index, 1);
					me.saveProfil(profils);
					me.displayProfils();
				}
			}
		});
		$('#profilList').append('<li class="divider"></li><li><a id="new_profil"><i class="fa fa-plus"></i> New profile</a></li><li><a data-toggle="modal" data-target="#deleteProfil"><i class="fa fa-sign-out"></i> Delete profiles</a></li>');
		$('.profilElem').click(function() {
			powerInstance.searchQuery = JSON.parse(me.getProfil($(this).attr('query')).query);
			powerInstance.processRequest($('#searchBtn'), false);
		});
		$('#new_profil').click(function() {
			bootbox.prompt("Enter profile name", function(result) {
				if (result) {
					me.newProfil(result);
				}
			});
		})
	}
}