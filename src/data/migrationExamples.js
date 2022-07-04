/* ================ EXAMPLES ===================== */
 await queryInterface.removeColumn('users',
                              'isAdmin');
                   .catch(e => {
                    console.log(e);
                   } );

 await queryInterface.changeColumn('users ',
  'walletId', {
    type: Sequelize.INTEGER,
    unique: true
  },)
  .catch(error => {
    console.log(error.toString());
  });

   await queryInterface.addColumn(Song.tableName,
       'isBlocked', {
              type: Sequelize.BOOLEAN,
              allowNull: false,
              defaultValue: false
       }).catch(error => console.log(error.toString()));


await queryInterface.removeConstraint(Notifications.tableName, 'PRIMARY');